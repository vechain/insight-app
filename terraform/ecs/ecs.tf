module "namespace" {
  source                = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//namespace?ref=v.1.1.3"
  env                   = local.env.environment
  namespace_name        = "${local.env.project}-${local.env.environment}"
  namespace_description = "Namespace for my insights project"
  vpc_id                = local.env.vpc_id
  app_name              = local.env.app_name
  project               = local.env.project
}

module "ecs-sg" {
  source      = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//security-groups?ref=v.1.4.6"
  env         = local.env.environment
  project     = local.env.project
  name        = "ecs"
  description = "Security group for insights app"
  vpc_id      = local.env.vpc_id

  ingress_rules = [
    {
      description      = "Allow All traffic"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = []
      security_groups  = []
    },
  ]

  egress_rules = [
    {
      description      = "Allow Oubound traffic"
      from_port        = 0
      to_port          = 0
      protocol         = "-1"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = []
    }
  ]
}

######################
# Public ALB Security Group
######################

resource "aws_security_group" "alb-sg" {
  description = "security-group-alb"
  name        = "${local.env.environment}-${local.env.project}-sg-alb"
  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    protocol    = "-1"
    to_port     = 0
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 80
    protocol    = "tcp"
    to_port     = 80
  }

  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 443
    protocol    = "tcp"
    to_port     = 443
  }

  tags = {
    Environment = local.env.environment
    Name        = "${local.env.environment}-${local.env.project}-sg-alb"
  }
  vpc_id = local.env.vpc_id
}

################################################################################
# Module For ECS Cluster Creation
################################################################################

module "ecs-cluster" {
  source  = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//ecs_cluster?ref=v.1.1.3"
  env     = local.env.environment
  project = local.env.project
  vpc_id  = local.env.vpc_id
  cidr    = local.env.vpc_cidr
}

################################################################################
# Module For ECS Load Balanced insights Service
################################################################################

module "ecs-backend-service-insights" {
  source                     = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//ecs-loadbalanced-webservice"
  region                     = local.env.region
  vpc_id                     = local.env.vpc_id
  cluster_name               = module.ecs-cluster.name
  autoscale_cluster_name     = module.ecs-cluster.name
  lb_subnets                 = local.env.public_subnets
  app_subnets                = local.env.private_subnets
  env                        = local.env.environment
  is_create_repo             = true
  secrets_enable             = false
  assign_public_ip           = false
  app_name                   = "insights-app"
  project                    = local.env.project
  cpu                        = local.env.cpu
  memory                     = local.env.memory
  cidr                       = local.env.vpc_cidr
  container_port             = 8001
  https_tg_port              = 8001
  certificate_arn            = "arn:aws:acm:eu-west-1:891377394468:certificate/7da6ac4f-16c4-4c65-b7b8-ad98a8bc2bdb"
  ecs_sg                     = [module.ecs-sg.security_group_id]
  rule_0_path_pattern        = ["/*"]
  alb_sg                     = [aws_security_group.alb-sg.id]
  enable_deletion_protection = local.env == "prod" ? true : false
  namespace_id               = module.namespace.namespace_id
  https_tg_healthcheck_path  = "/"
  runtime_platform = [{
    operating_system_family = "LINUX",
    cpu_architecture        = "X86_64"
  }]

  log_metric_filters = [
    {
      name    = "AppUnhealthy",
      pattern = "Application is UNHEALTHY"
    }
  ]

  environment_variables = [
    {
      name  = "APPLICATION_NAME"
      value = "explorer"
    },
    {
      name  = "ENVIRONMENT_NAME"
      value = local.env.environment
    },
    {
      name  = "VUE_APP_SOLO_URL"
      value = "galactica.green.dev.node.vechain.org"
    }
  ]
  depends_on = [module.ecs-cluster]
}
