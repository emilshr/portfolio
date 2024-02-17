---
title: I'm not sure I like serverless
author: Emil Sharier
pubDatetime: 2024-02-15T18:33:45.142Z
slug: how-serverless-almost-screwed-me-over
draft: false
tags:
  - serverless
  - web-dev
  - AWS
  - rant
ogImage: "https://docs.localstack.cloud/user-guide/integrations/serverless-framework/serverless-logo.png"
description: A rant about how I do not endorse the use of serverless framework
---

### So what is this about?

This is a rant about the [Serverless](https://www.serverless.com/) CLI tool that the existing product at the company that I'm working at is using.

Serverless is a tool that has multiple AWS templates for bootstrapping Node and Python apps easily. Now on the surface, it might make things easy.

Here are a few of the templates that you get with the serverless CLI

![Serverless CLI](@assets/images/serverless-cli.png)

As you can see, there are a quite a lot of templates available for writing apps with Node and/or Python connecting different AWS resources. This is specifically helpful when you aren't experienced in AWS. For a start-up, these sort of tools can even replace the need to hire a dev-ops focused engineer ( ⚠️ Trust me, this is so not right. Please invest and hire a good dev-ops engineer and you won't regret this choice further down the line)

### How stable is Serverless?

In short, it is pretty stable. However, when you want to try out new features that gets shipped to AWS resources. You probably would end up waiting on the plugin maintainers to work and and release the update for serverless. This is expected, but companies cannot just upgrade to a major version of the serverless plugin that is released just like that.

Because in real world usage, the plugin has to be tried and tested. Usually in software lifecycle, this can take a couple of iterations. As a business owner, you obviously wouldn't upgrade if there is even a small chance of outage. For example, a couple of years ago I remember waiting for quite some time to upgrade my lambdas' to `Node 16.x` that AWS had released, but the serverless maintainers took a little bit more time than expected to support `16.x`. The lambdas that my team had written were stuck on `Node 14.x`. This wasn't a big concern for me, but you get the picture. Such situations can come up.

### Once you're deep enough, it'll be too late to turn back

When you bet your company on Serverless and start building your product around this, things may look alright in the beginning. But as the complexity increases or when you need services which may not be officially supported by serverless or their plugins, you might feel like getting rid of serverless and managing your AWS resources yourself. But usually, by the time you get this realization it would be too late to turn back.

The plugin ecosystem is also okay-ish with serverless. But when you start importing more and more community maintained plugins and start relying on them heavily, you would often find yourselves in Github issue threads trying to figure out a hack for the thing that you're trying to solve. As a business owner or a developer working on the project, this is the last thing you want to happen.

### What problems did I face?

In a start-up environment, requirements & features change every now and then. So different feature requests required different AWS services, since we were using serverless it was super easy to deploy and start a new API which connected to multiple services. Now when these features became deprecated we would usually tear down these resources using the serverless CLI. This was good, or so we thought. Upon close inspection of our AWS accounts and their resource usages, we noticed that some of these "resources" that we thought we had removed was still up and they were racking up the AWS bills without any usage. So a couple of us engineers had to backtrack, figure out the connected resources and manually delete stuff. This actually cut down the bill by 20% or so. This is one of my major problems with serverless.

### Conclusion

Now don't get me wrong. Serverless framework is an absolutely amazing tool when you're starting out, you get to easily deploy your product without worrying too much about the infrastructure. This is an absolute game changer for business owners with limited resources. But when the times comes for your business to scale up (vertically or horizontally), you might wanna look at your AWS bills and figure out ways to optimize and cut costs. That being said, if it works for you go ahead with it. For me, I'd prefer somebody who has more hands on experience with AWS stuff.

<!--
References
- What is serverless?
- How stable is serverless?
- Why are people using serverless?
- What are the generic problems you may face?
- What problems did I face?
- What are the attempts at solving my problems?
- What didn't work out?
- Rant about deleting stuff on prod
- Ciao
 -->
