import { Config } from "./bin/config.types";

export const config: Config = {
  hostedZoneId: 'Z07705461XG1HG0KETUGR',
  certificateArn: 'arn:aws:acm:us-east-1:236003170607:certificate/211b0d3f-2d14-44bb-aba4-0a426d6190b7',
  domainName: 'davidosborne.uk', // root domain name
  stackPrefix: 'douk', // prefix for stack names
}