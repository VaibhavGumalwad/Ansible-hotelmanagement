output "app_server_public_ip" {
  value = aws_instance.app_server.public_ip
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "rds_endpoint" {
  value = aws_db_instance.mysql.address  # address gives host only, no port — safe for JDBC URL
}

output "db_username" {
  value = aws_db_instance.mysql.username
}

output "db_password" {
  value = aws_db_instance.mysql.password
  sensitive = true
}

output "ecr_registry" {
  value = split("/", aws_ecr_repository.backend.repository_url)[0]  # extracts just the registry URL part
}

output "key_pair_name" {
  value = aws_key_pair.hotel_booking_key.key_name
}

output "private_key_file" {
  value = "${path.module}/hotel-booking-key.pem"
  description = "Path to private key file"
}
