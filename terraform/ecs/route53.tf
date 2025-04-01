resource "aws_route53_record" "www" {
  zone_id = "Z01418181LYYCC8FFHJY4"
  name    = "galactica.insights.vechain.org"
  type    = "A"

  alias {
    name                   = module.ecs-backend-service-insights.alb_dns_name
    zone_id                = "Z32O12XQLNTSW2"
    evaluate_target_health = true
  }
}
