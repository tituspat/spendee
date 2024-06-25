
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
}

resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits = 4096
}

variable "key_name" {
  description = "terraform-key"
  default     = "terraform-key"  
}

resource "aws_key_pair" "service_key_pair" {
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

resource "local_file" "private_key" {
  content = tls_private_key.rsa_4096.private_key_pem
  filename = var.key_name
}

resource "aws_security_group" "allow_http_ssh" {
  description = "Allow HTTP and SSH inbound traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "old_public_instance" {
  ami = "ami-003c463c8207b4dfa"
  instance_type = "t2.micro"
  key_name = aws_key_pair.service_key_pair.key_name
  vpc_security_group_ids = [aws_security_group.allow_http_ssh.id]

  tags = {
    Name = "terraform-aws"
  }

    lifecycle {
    create_before_destroy = true
  }
}


# Define the Elastic IP to be reassigned
resource "aws_eip" "elastic_ip" {
  instance = aws_instance.old_public_instance.id
  vpc      = true
}

# Define the new instance (to replace the old instance)
resource "aws_instance" "new_instance" {
  ami                    = "ami-003c463c8207b4dfa"
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.service_key_pair.key_name
  vpc_security_group_ids = [aws_security_group.allow_http_ssh.id]

  tags = {
    Name = "terraform-aws"
  }

  depends_on = [aws_instance.old_public_instance]
}

# Reassign the Elastic IP to the new instance
resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.new_instance.id
  allocation_id = aws_eip.elastic_ip.id
}

output "instance_ip" {
  value = aws_eip.elastic_ip.public_ip
}
# resource "aws_eip" "elastic_ip" {
#   vpc = true
#   id = "eipassoc-02edc7d4d862d375d"
# }

# resource "aws_eip_association" "eip_assoc" {
#   instance_id   = aws_instance.public_instance.id
#   allocation_id = aws_eip.elastic_ip.id
# }

# output "instance_ip" {
#   value = aws_eip.elastic_ip.public_ip
# }
# # value = aws_instance.public_instance.public_ip