provider "aws" {
  region = "ap-southeast-1"  # Ganti dengan region AWS yang Anda gunakan
}

# Membuat VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Membuat Subnet
resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-southeast-1"  # Ganti dengan availability zone yang Anda gunakan
}

# Membuat Security Group
resource "aws_security_group" "allow_port_3000" {
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Menggunakan template untuk user data
data "template_file" "userdata" {
  template = file("${path.module}/userdata.tpl")

  vars = {
    dockerhub_username = var.dockerhub_username
    dockerhub_password = var.dockerhub_password
  }
}

# Membuat Instance EC2
resource "aws_instance" "app_server" {
  ami                    = "ami-003c463c8207b4dfa"  # Ganti dengan AMI yang sesuai
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.main.id
  security_groups        = [aws_security_group.allow_port_3000.name]
  associate_public_ip_address = true

  user_data = data.template_file.userdata.rendered

  tags = {
    Name = "AppServer"
  }
}

output "instance_public_ip" {
  value = aws_instance.app_server.public_ip
}
