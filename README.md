landscapes.io
===============
Designed to handle the most complicated DevOps deployments, landscapes.io is an AWS CloudFormation management tool built with the MEAN stack.

### Set auth via config/env/default.js
```
authStrategy: 'local', // ldap
```

### Database Seeding

To have default local account(s) created at runtime:

In Development:
```
$ MONGO_SEED=true npm start
```
Landscapes will create 'user' and 'admin' accounts if they don't exist. 

In Production:
```
$ MONGO_SEED=true npm start:prod
```
This will create user 'admin' if the user does not already exist.

**You can get the autogenerated passwords from console output.**

---

### LDAP Integration

By default, landscapes.io is designed to work with LDAP through the [passport-ldapauth](https://github.com/vesse/passport-ldapauth) authentication strategy for [Passport](http://passportjs.org/).

**Launch development OpenLDAP and phpLDAPadmin servers...**
```
$ docker-compose -f docker-compose-ldap.yaml up
```

**Test connection to OpenLDAP...**
```
$ curl "ldap://localhost/dc=landscapes,dc=io" -u "cn=admin,dc=landscapes,dc=io"
Enter host password for user 'cn=admin,dc=landscapes,dc=io': password
```

**Seed OpenLDAP with development data...**
```
ldapmodify -a -f development.ldif -x -H ldap://localhost:389 -w password -D cn=admin,dc=landscapes,dc=io
ldapmodify -f development-set-roles.ldif -x -H ldap://localhost:389 -w password -D cn=admin,dc=landscapes,dc=io 
```

**Change OpenLDAP password...**
```
ldappasswd -s n3wP@ssw0rd -W -D cn=admin,dc=landscapes,dc=io" -x "uid=test_admin_user,ou=people,dc=landscapes,dc=io"
```

---

The [landscapes.io wiki](https://github.com/OpenWhere/landscapes.io/wiki) is a repository for detailed documentation.

---

###Installation

landscapes.io is available via git:

**git**
```
$ git clone git://github.com/OpenWhere/landscapes.io.git
```

landscapes.io depends depends on [node.js](http://nodejs.org/), [npm](https://www.npmjs.org/) and [Bower](http://bower.io/).



#### MongoDB

landscapes.io requires MongoDB for data persistence. OOTB landscapes.io is
configured to access a [MongoDB](http://www.mongodb.org) server on `localhost`
using the default port of `27017`.


#### ImageMagick

landscapes.io requires [ImageMagick](http://www.imagemagick.org). This dependency may be installed as follows.

**CentOS, RHEL and AmazonLinux**

	$ yum install ImageMagick


**Ubuntu**

	$ sudo apt-get install imagemagick


**OSX**

	$ brew install imagemagick


**Windows**

* Go to the [Windows Binary Release page on the ImageMagick website](http://www.imagemagick.org/script/binary-releases.php#windows) and then download and install the appropriate version.


### AWS Service Account

landscapes.io requires an AWS IAM account with full access to AWS CloudFormation.

#### I. Create an AWS Service Account

1. Sign into your [AWS Management Console](https://console.aws.amazon.com).
2. Navigate to the [IAM Dashboard](https://console.aws.amazon.com/iam).
3. Go to the [IAM Users](https://console.aws.amazon.com/iam/home#users) page and click the **Create New Users** button.
4. In the **Create User** modal window, enter the name of your Service Account (e.g., landscapes-svc).
5. Make sure **Generate an access key for each User** is checked and then click the **Create** button.
6. The next modal window should state: **Your 1 User(s) have been created successfully.**
7. Click the **Download Credentials** button.
    * This "credentials.csv" file contains the **Access Key Id** and **Secret Access Key** you will need to configure landscapes.io.
8. Click the **Close Window** button.
10. At the [IAM Users](https://console.aws.amazon.com/iam/home#users) page, check the box for your new Service Account.
11. Select the **Permissions** tab and then click the **Attach User Policy** button.
12. In the **Manage User Permissions** modal window, select the **Policy Generator** radio button and click **Select**.
13. Set the **Edit Permissions** form to the following values:
    * **Effect**: Allow
    * **AWS Service**: AWS CloudFormation
    * **Actions**: All Actions Selected
14. Click the **Add Statement** button and then click **Continue**.
15. In the **Set Permissions** form click the **Apply Policy** button.

#### II. Enter Your AWS Service Account Data into landscapes.io configuration

1. Open the "credentials.csv" file that you downloaded in step 7 above.
2. Open `/lib/config/aws/config.json` for editing.
3. Copy and paste your AWS Service Account's **accessKeyId** and **secretAccessKey** into `config.json`.
4. Save your changes to `/lib/config/aws/config.json`.


### License

Copyright 2014 OpenWhere, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.