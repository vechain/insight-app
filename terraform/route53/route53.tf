module "domain" {
  source           = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//route53"
  public_zone_name = "galactica.insights.vechain.org"
  domain_name      = "galactica.insights.vechain.org"
  vpc_id           = local.env.vpc_id
  project          = local.env.app_name
  env              = "prod"
  create_cert      = true
}
