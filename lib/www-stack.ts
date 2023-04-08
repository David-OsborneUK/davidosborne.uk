import { CloudFrontToS3 } from '@aws-solutions-constructs/aws-cloudfront-s3';
import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { AaaaRecord, ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export interface WwwStackProps extends StackProps {
  hostedZoneId: string
  certificateArn: string
  domainName: string
}

export class WwwStack extends Stack {
  constructor(scope: Construct, id: string, props: WwwStackProps) {
    super(scope, id, props);

    const {hostedZoneId, certificateArn, domainName} = props
    const wwwDomainName = `www.${domainName}`

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId,
      zoneName: domainName,
    })

    const cloudFrontToS3 = new CloudFrontToS3(this, 'cloudfrontToS3', {
      cloudFrontDistributionProps: {
        certificate: Certificate.fromCertificateArn(this, 'certificate', certificateArn),
        defaultRootObject: 'index.html',
        domainNames: [domainName, wwwDomainName],
      },
    })

    new BucketDeployment(this, 'BucketDeployment', {
      sources: [Source.asset('./public')],
      destinationBucket: cloudFrontToS3.s3Bucket!
    })

    const recordTarget = RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontToS3.cloudFrontWebDistribution))

    new ARecord(this, 'rootARecord', {
      target: recordTarget,
      zone: hostedZone,
      recordName: domainName,
    })
    new AaaaRecord(this, 'rootAaaaRecord', {
      target: recordTarget,
      zone: hostedZone,
      recordName: domainName,
    })

    new ARecord(this, 'wwwARecord', {
      target: recordTarget,
      zone: hostedZone,
      recordName: wwwDomainName,
    })
    new AaaaRecord(this, 'wwwAaaaRecord', {
      target: recordTarget,
      zone: hostedZone,
      recordName: wwwDomainName,
    })
    new CfnOutput(this, 'CloudFrontDomain', {
      value: cloudFrontToS3.cloudFrontWebDistribution.distributionDomainName,
    })
  }
}
