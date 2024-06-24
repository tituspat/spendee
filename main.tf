variable "docker_username" {
  description = "Docker username"
}

variable "docker_password" {
  description = "Docker password"
  sensitive   = true
}

variable "docker_image" {
  description = "Docker image to pull and run"
}

provider "aws" {
  region = "ap-southeast-1"
}


# Membuat VPC
data "aws_vpc" "existing" {
  id = "vpc-04e356bf9b40a9111"  # Ganti dengan ID VPC yang sudah ada
}

# Gantikan dengan ID Subnet yang sudah ada
data "aws_subnet" "existing" {
  id = "subnet-0f1d0c19af3a68b6b"  # Ganti dengan ID Subnet yang sudah ada
}

# Membuat Security Group
resource "aws_security_group" "allow_port_3000" {
  vpc_id = data.aws_vpc.existing.id

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

# Membuat Instance EC2
resource "aws_instance" "app" {
  ami                    = "ami-003c463c8207b4dfa"  # AMI untuk Amazon Linux 2
  instance_type          = "t2.micro"
  subnet_id              = data.aws_subnet.existing.id
  vpc_security_group_ids = [aws_security_group.allow_port_3000.id]
  associate_public_ip_address = true

  key_name = "spendy-2"  # Ganti dengan nama kunci SSH Anda

  tags = {
    Name = "ExpressJS-EC2"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo apt-get install -y docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "sudo usermod -aG docker ubuntu",
      "docker login -u ${var.docker_username} -p ${var.docker_password}",
      "docker pull ${var.docker_image}",
      "docker run -d -p 3000:3000 ${var.docker_image}"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/spendy-2.pem")
      host        = self.public_ip
    }
  }
}

# Output
output "instance_ip" {
  value = aws_instance.app.public_ip
}

