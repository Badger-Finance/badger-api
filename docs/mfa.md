# Local MFA Authentication

Badger IAM policies require users to be authenticated via MFA to utilize resources.
The script `setup-mfa.sh` exists to asset with the command for retrieving the required authorization.

## Prequisites

- MFA setup on Badger AWS Account
- MFA device ARN

## Setting up for MFA

The script requires minor setup to use - configuring an environment variable.

```
export MFA_ARN=<my_device_arn>
```

or configure this in your `.zshrc` or whatever shell configuration you use.

```
➜  badger-api git:(mfa-usage) ✗ ./setup-mfa.sh $MFA_ARN <TOKEN>
{
    "Credentials": {
        "AccessKeyId": "",
        "SecretAccessKey": "",
        "SessionToken": "",
        "Expiration": "2022-02-02T02:30:55+00:00"
    }
}
```

## Configuring AWS

These credentials should be used to create a profile `badger-mfa` in the amazon credentials file.
Instructions or explanation of the credentials file can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

```
[badger-mfa]
aws_access_key_id=
aws_secret_access_key=
aws_session_token=
```

Once this profile is set up using the output of the authentication the shell profile should be updated as well running:

```
export AWS_PROFILE=badger-mfa
```

Now all your services should have access to Badger AWS infrastructure.
