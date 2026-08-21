# AI Enablement Learning Hub

This is a portable static website. The production build is ordinary HTML, CSS,
JavaScript, and image files with no server, database, or OpenAI runtime required.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Upload the contents of `dist/` to any static host. For services that build from
the repository, use `npm run build` as the build command and `dist` as the
publish directory.

The course catalog lives at `/`. Each course has a durable subpath; the first
course is available at `/api-basics/`.

## Viewer registration

Viewer registration is AWS-native. API Gateway receives the form, Lambda
validates it, and DynamoDB stores the registered learner and their content
interests. No email is sent and Amazon SES is not required. Set the GitHub
Actions repository variable `AWS_SUBSCRIBE_URL` to the stack's
`ViewerRegistrationUrl` output to activate the form.

## AWS hosting

`infrastructure/static-site.yml` creates a private, versioned S3 bucket and a
CloudFront distribution that can read it through Origin Access Control. The
bucket is retained if the CloudFormation stack is removed, protecting the site
files from accidental deletion.

The first deployment should use CloudFront's temporary address. Add the custom
domain only after that version works. A custom-domain certificate for
CloudFront must be issued by AWS Certificate Manager in `us-east-1`.

The GitHub workflow expects one encrypted secret:

- `AWS_ROLE_ARN` — an AWS role trusted through GitHub's OIDC provider

It also expects three repository variables:

- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`

The optional `AWS_SUBSCRIBE_URL` variable activates viewer registration.

Using OIDC avoids storing a long-lived AWS access key in GitHub.

## Checks

```bash
npm test
npm run lint
```

The payment exercise is a browser-only simulation. It does not send card data
or make a real payment.
