provider "aws" {
  region = "ap-southeast-1"
}

# Membuat VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
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

resource "aws_instance" "app" {
  ami           = "ami-003c463c8207b4dfa"  # AMI untuk Amazon Linux 2
  instance_type = "t2.micro"
  subnet_id              = aws_subnet.main.id
  security_groups        = [aws_security_group.allow_port_3000.name]
  associate_public_ip_address = true

  tags = {
    Name = "ExpressJS-EC2"
  }

  key_name = "spendy-2"  # Ganti dengan nama kunci SSH Anda

}


output "output" {
    value = aws_instance.app.public_ip
}
