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

resource "aws_instance" "app" {
  ami           = "ami-003c463c8207b4dfa"  # AMI untuk Amazon Linux 2
  instance_type = "t2.micro"
  subnet_id              = aws_subnet.main.id
  security_groups        = [aws_security_group.allow_port_3000.name]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              docker login -u <YOUR_DOCKERHUB_USERNAME> -p <YOUR_DOCKERHUB_PASSWORD>
              docker pull <YOUR_DOCKERHUB_REPOSITORY>:<TAG>
              docker run -d -p 3000:3000 <YOUR_DOCKERHUB_REPOSITORY>:<TAG>
              EOF

  tags = {
    Name = "spendy-EC2"
  }

  key_name = "spendy-2"  # Ganti dengan nama kunci SSH Anda

}


output "output" {
  value = {
    ssh_access = "ssh ubuntu@${aws_instance.app.public_ip}"
    public_ip = aws_instance.app.public_ip
    public_dns = aws_instance.app.public_dns
  }
}
