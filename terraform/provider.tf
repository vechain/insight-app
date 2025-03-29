provider "aws" {
  region = "eu-west-1"
  default_tags {
    tags = {
      Terraform = "true"
      Project   = "insight"
    }
  }
}

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      #version = "3.75.1"
    }

  }
  backend "s3" {
    key                  = "indexer-insights-tf-state/indexer.tfstate"
    region               = "eu-west-1"
    workspace_key_prefix = "workspaces"
  }
}


