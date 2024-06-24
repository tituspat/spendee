variable "aws_region" {
  description = "The AWS region to deploy in"
  default     = "ap-southeast-1"
}

variable "dockerhub_username" {
  description = "DockerHub Username"
  type        = string
}

variable "dockerhub_password" {
  description = "DockerHub Password"
  type        = string
  sensitive   = true
}