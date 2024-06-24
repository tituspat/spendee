provider "aws" {
  region = "ap-southeast-1"
}

# Membuat VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
}

# Membuat Subnet
resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-southeast-1a"
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

# Membuat Instance EC2
resource "aws_instance" "app" {
  ami                    = "ami-003c463c8207b4dfa"  # AMI untuk Amazon Linux 2
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.allow_port_3000.id]
  associate_public_ip_address = true

  key_name = "spendy-2"  # Ganti dengan nama kunci SSH Anda

  tags = {
    Name = "ExpressJS-EC2"
  }

  depends_on = [aws_security_group.allow_port_3000]
}

# Output
output "instance_public_ip" {
  value = aws_instance.app.public_ip
}
