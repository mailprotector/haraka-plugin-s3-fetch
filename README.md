# haraka-plugin-s3-fetch
A Haraka plugin to fetch config files from an S3 bucket.

## Install
Install with npm

`npm install @mailprotector/haraka-plugin-s3-fetch --save`

## Setup

### Enable Plugin
Add to `plugin` file in the haraka config folder
```text
@mailprotector/haraka-plugin-s3-fetch
```
### Config

Config options are set in `s3-fetch.json`:

**Files**

| Parameter | Description                            | Type   | Default Value |
| --------- | -------------------------------------- | ------ | ------------- |
| bucket    | s3 bucket name where file is located   | string | none          |
| key       | s3 key of file                         | string | none          |
| path      | local output path to store the file in | string | none          |

**Credentials**

There are a few options when it comes to setting AWS credentials. Optionally, you can add a `credentials` directive to the config file pass in specfic AWS credentials or STS session tokens.
Refer to the [AWS documentation](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) for more details on passing credentials

| Parameter       | Description           | Type   | Default Value |
| --------------- | --------------------- | ------ | ------------- |
| accessKeyId     | AWS API key ID        | string | none          |
| secretAccessKey | AWS secret access key | string | none          |
| sessionToken    | STS assume role token | string | none          |
| region          | AWS region            | string | none          |

##

![alt text](https://i1.wp.com/mailprotector.com/wp-content/uploads/2020/03/cropped-logo-2x.png)

[About Mailprotector](https://mailprotector.com/about-mailprotector)