---
title: GoLang for Typescript devs
pubDate: "2024-02-18"
---

This is a small series that I would be regularly updating as I have started learning [Golang](https://go.dev/). This isn't an actual tutorial or anything but rather a small collection of mistakes I made and things I overlooked.

- Functions have to start with a capital letter if you're looking to export them from modules

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
However, I just came to know that in order to export a function, you've got to start the function name with a capital letter. So the updated snippet would look like

```go
// my-published-module.go
package my_module

import "log"

func PrintMe() { // ✅ This is correct
  log.Printf("Hello world v1")
}

func AnotherPrint() { // ✅ This is correct
  log.Printf("New world")
}

// app-where-i-am-consuming-module.go
package github.com/emilshr/stuff

import "github.com/emilshr/my-published-module"

func main() {
  my_module.PrintMe() // ✅ This works
}
```
