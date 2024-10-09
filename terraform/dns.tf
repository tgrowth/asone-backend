resource "aws_route53_record" "api" {
  zone_id = var.route53_zone_id
  name    = "api.asone.life"
  type    = "A"

  alias {
    name                   = aws_lb.api_lb.dns_name
    zone_id                = aws_lb.api_lb.zone_id
    evaluate_target_health = true
  }
}
