resource "aws_ecr_repository" "backend" {
  name                 = "hotel-booking-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "${var.project_name}-backend-ecr" }
}

resource "aws_ecr_repository" "frontend" {
  name                 = "hotel-booking-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "${var.project_name}-frontend-ecr" }
}
