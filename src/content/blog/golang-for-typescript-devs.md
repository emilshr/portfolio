---
title: Learning Golang as a Typescript dev
author: Emil Sharier
pubDatetime: 2024-02-18T08:43:44.076Z
modDatetime: 2024-02-18T08:48:44.076Z
slug: golang-for-typescript-devs
draft: false
tags:
  - golang
  - web-dev
  - golang-for-ts-dev
ogImage: "https://miro.medium.com/v2/resize:fit:1400/0*SoqCeEz9EctJBXKw.png"
description: A series containing the common and silly mistakes that I have made while learning Golang as a Typescript dev
---

## Hey all 👋🏽

This is a small series that I would be regularly updating as I have started learning [Golang](https://go.dev/). This isn't an actual tutorial or anything but rather a small collection of mistakes I made and things I overlooked.

### Functions have to start with a capital letter if you're looking to export them from modules

```go
// my-published-module.go
package my_module

import "log"

func printMe() { // 👈🏽 This is wrong
  log.Printf("Hello world v1")
}

func anotherPrint() { // 👈🏽 This is wrong
  log.Printf("New world")
}

// app-where-i-am-consuming-module.go
package github.com/emilshr/stuff

import "github.com/emilshr/my-published-module"

func main() {
  my_module.printMe() // 👈🏽 This errors out as undefined
  // as the compiler is unable to find the function
}
```

I was pulling my hair trying to figure out a solution for this. When I published a sample module with the syntax mentioned above, I was unable to access the function and I was frustrated trying to figure out why.

However, I just came to know that in order to export a function, you've got to start the function name with a capital letter. Yes, I feel so dumb right now 🤦🏽‍♂️

So the updated snippet would look like

```go
// my-published-module.go
package my_module

import "log"

func PrintMe() { // 👈🏽 This is wrong
  log.Printf("Hello world v1")
}

func AnotherPrint() { // 👈🏽 This is wrong
  log.Printf("New world")
}

// app-where-i-am-consuming-module.go
package github.com/emilshr/stuff

import "github.com/emilshr/my-published-module"

func main() {
  my_module.PrintMe() // ✅ This works
}
```
