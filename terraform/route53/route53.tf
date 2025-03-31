# Route53 Hosted Zone

# resource "aws_route53_zone" "public" {
#   name =  "galactica.insights.vechain.org"

#   tags = {
#     Name        = "galactica.insights.vechain.org"
#     Environment = local.env.environment
#     Project     = local.env.project
#     Terraform   = "true"
#   }
# }

module "domain" {
  source           = "git::git@github.com:/vechain/terraform_infrastructure_modules.git//route53"
  public_zone_name = "galactica.insights.vechain.org"
  domain_name      = "galactica.insights.vechain.org"
  vpc_id           = local.env.vpc_id
  project          = local.env.app_name
  env              = "prod"
  create_cert      = true
}
