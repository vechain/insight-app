## ecr creation
module "ecr" {
  source = "git@github.com:vechain/terraform_infrastructure_modules.git//ecr?ref=6bd2e52" # v.2.0.4
  project  =  local.env.project
  env      =  local.env.environment
  app_name = "insight-app"

  enable = true
  enable_scan_configuration = true
  image_tag_mutability = "MUTABLE"
}