# pull in workspace specific environment settings from yaml file under environments directory
# can then be used as local.env.<key> in other files
locals {
env = yamldecode(file("config/config.yml"))
}