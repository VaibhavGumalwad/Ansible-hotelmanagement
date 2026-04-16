output "app_server_public_ip" {
  value = aws_instance.app_server.public_ip
}

output "jenkins_server_public_ip" {
  value = aws_instance.jenkins_server.public_ip
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "rds_endpoint" {
  value = aws_db_instance.mysql.endpoint
}

output "jenkins_url" {
  value = "http://${aws_instance.jenkins_server.public_ip}:8080"
}
