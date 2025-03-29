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

################################################################################
# Module For ECS Cluster creation
################################################################################

module "ecs-cluster" {
  source  = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//ecs_cluster?ref=v.1.1.3"
  env     = local.env.environment
  project = local.env.project
  vpc_id  = local.env.vpc_id
  cidr    = local.env.cidr
}


################################################################################
# Module For ECS Non-Load Balanced Services for all enabled_nets
################################################################################

module "ecs-backend-service" {
  for_each                           = local.env.enabled_nets

  depends_on                         = [module.ecs-cluster]
  source                             = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//ecs-backend-service?ref=v.1.4.22"

  vpc_id                             = local.env.vpc_id
  region                             = local.env.region
  cluster                            = module.ecs-cluster.name
  subnets                            = local.env.private_subnets
  env                                = local.env.environment
  network                            = each.key
  is_create_repo                     = false
  ecr_repo_uri                       = each.value.ecr_repo_uri
  secrets_enable                     = false
  ecr_image_tag                      = lookup(each.value, "image_version", "latest")
  app_name                           = "${each.key}-indexer"
  project                            = local.env.project
  cpu                                = each.value.cpu
  memory                             = each.value.memory
  cidr                               = local.env.cidr
  security_groups                    = [module.ecs-sg.security_group_id]
  desired_capacity                   = "1"
  containerPort                      = 8080
  hostPort                           = 8080
  namespace_id                       = module.namespace.namespace_id
  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 100

  log_metric_filters = [
    for filter in each.value.log_metric_filters : {
      name    = filter.name
      pattern = filter.pattern
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
      value = "https://galactica.green.dev.node.vechain.org/"
    },
    {
      name  = "APP_LOG_LEVEL"
      value = "INFO"
    },
    {
      name  = "LOG_INTERVAL"
      value = "200"
    },
    {
      name  = "SPRING_DATA_LOG_LEVEL"
      value = "INFO"
    },
    {
      name  = "APP_LOGGER"
      value = "CloudWatch"
    }
  ]
}
