import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import {Fn} from 'aws-cdk-lib';

export class TsStarterStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = this.initializeSuffix();
    const bucket = new Bucket(this, 'TsBucket', {
      bucketName: `tarun-bucket-${suffix}`,
      lifecycleRules:[
        {
          expiration: cdk.Duration.days(2)
        }
      ]
    })

    new cdk.CfnOutput(this, 
      'TsBucketOutput', {
        value:bucket.bucketName
      })
  }

  private initializeSuffix(){
    //Method to get last bit of the 'Stack ID from AWS' and use it as a suffix
    const shortStackId = Fn.select(2, Fn.split('/', this.stackId));
    const suffix = Fn.select(4, Fn.split('-', shortStackId));
    
    /*
    Example for this.stackId is "arn:aws:cloudformation:us-west-2:123456789012:stack/my-stack-name/abcd1234-efgh5678-ijk-l9012-mnop3456"

    Split the stack ID by '/' and select the third element (index 2)
    shortStackId will be "abcd1234-efgh5678-ijkl9012-mnop3456"

    Split shortStackId by '-' and select the fifth element (index 4)
    suffix will be "mnop3456"

    */
    return suffix;
  }
}
