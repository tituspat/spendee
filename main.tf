provider "aws" {
  region = "ap-southeast-1"
}

resource "aws_instance" "app" {
  ami           = "ami-003c463c8207b4dfa"  # AMI untuk Amazon Linux 2
  instance_type = "t2.micro"

  tags = {
    Name = "ExpressJS-EC2"
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
