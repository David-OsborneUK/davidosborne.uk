import { Stack, StackProps } from "aws-cdk-lib";
import { HostedZone, MxRecord, TxtRecord } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export interface ImprovMxMailForwarderStackProps extends StackProps {
  hostedZoneId: string
  domainName: string
}
/**
 * Set up Route53 records to allow email forwarding via improvmx.com
 */
export class ImprovMxMailForwarderStack extends Stack {
  constructor(scope: Construct, id: string, props: ImprovMxMailForwarderStackProps) {
    super(scope, id, props);
    const {hostedZoneId, domainName} = props

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    })

    new MxRecord(this, 'ImprovMxMxRecord', {
      values: [
        {priority: 10, hostName: 'mx1.improvmx.com.'},
        {priority: 20, hostName: 'mx2.improvmx.com.'}
      ],
      zone: hostedZone,
    })

    new TxtRecord(this, 'ImprovMxTxtRecord', {
      values: [
        'v=spf1 include:spf.improvmx.com ~all',
      ],
      zone: hostedZone,
    })
  }
}