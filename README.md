# haraka-plugin-s3-fetch
A Haraka plugin to fetch config files from an S3 bucket.

## INSTALL
Install with npm

`npm install @mailprotector/haraka-plugin-s3-fetch --save`

## CONFIG
### Files
Add s3-fetch.json in the config folder with the following settings for each file you'd like to load:
```
{
    "files": [
        {
            "bucket": "haraka-config-bucket",
            "key": "tls.ini",
            "path": "/etc/haraka/config/tls.ini"
        },
        ...
    ]
}
```

### AWS Credentials
There are a few options when it comes to setting AWS credentials. Optionally, you can add a `credentials` directive to the config file pass in specfic AWS credentials or STS session tokens.
Refer to the [AWS documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) for more details on passing credentials

```
    "credentials": {
        "accessKeyId": "my-access-key-id",
        "secretAccessKey": "my-secret-access-key",
        "sessionToken": "my-session-token", (optional)
        "region": "us-east-1"
    }
```

##

![alt text](https://i1.wp.com/mailprotector.com/wp-content/uploads/2020/03/cropped-logo-2x.png)

[About Mailprotector](https://mailprotector.com/about-mailprotector)