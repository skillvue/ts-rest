# ts-rest

<p align="center">
 <img src="https://avatars.githubusercontent.com/u/109956939?s=400&u=8bf67b1281da46d64eab85f48255cd1892bf0885&v=4" height="150"></img>
</p>

 <p align="center">RPC-like client and server helpers for a magical end to end typed experience</p> 
 <p align="center">
   <a href="https://www.npmjs.com/package/@ts-rest/core">
   <img src="https://img.shields.io/npm/v/@ts-rest/core.svg" alt="langue typescript"/>
   </a>
   <a href="https://www.npmjs.com/package/@ts-rest/core"/>
   <img alt="npm" src="https://img.shields.io/npm/dw/@ts-rest/core"/>
     <a href="https://github.com/ts-rest/ts-rest/blob/main/LICENSE"></a>
    <img alt="GitHub" src="https://img.shields.io/github/license/ts-rest/ts-rest"/> 
   <img alt="GitHub Workflow Status" src="https://img.shields.io/bundlephobia/minzip/@ts-rest/core?label=%40ts-rest%2Fcore"/>
   <img alt="GitHub Workflow Status" src="https://img.shields.io/discord/1055855205960392724"/>
   
 </p>

# Introduction

ts-rest provides an RPC-like client side interface over your existing REST APIs, as well as allowing you define a _separate_ contract implementation rather than going for a 'implementation is the contract' approach, which is best suited for smaller or simpler APIs.

If you have non typescript consumers, a public API, or maybe want to add type safety to your existing REST API? ts-rest is what you're looking for!

## Features

- End to end type safety 🛟
- Magic RPC-like API 🪄
- Tiny bundle size 🌟 (1kb!)
- Well-tested and production ready ✅
- No Code Generation 🏃‍♀️
- Zod support for body parsing 👮‍♀️
- Full optional OpenAPI integration 📝

## Quickstart

Install the core package

```bash
yarn add @ts-rest/core
# Optional react-query integration
yarn add @ts-rest/react-query
# Pick your backend
yarn add @ts-rest/nest @ts-rest/express
# For automatic server OpenAPI gen
yarn add @ts-rest/open-api
```

Create a contract, implement it on your server then consume it in your client. Incrementally adopt, trial it with your team, then get shipping faster.

<div align="center" style={{margin: "50px"}}>
<h2>👉 Read more on the official <a href="https://ts-rest.com/docs/quickstart?utm_source=github&utm_medium=documentation&utm_campaign=readme">Quickstart Guide</a>👈</h2>
</div>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ts-rest/ts-rest&type=Timeline)](https://star-history.com/#ts-rest/ts-rest&Timeline)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://gabro.la"><img src="https://avatars.githubusercontent.com/u/1728215?v=4?s=100" width="100px;" alt="Youssef Gaber"/><br /><sub><b>Youssef Gaber</b></sub></a><br /><a href="https://github.com/ts-rest/ts-rest/commits?author=Gabrola" title="Code">💻</a> <a href="#ideas-Gabrola" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ts-rest/ts-rest/commits?author=Gabrola" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://github.com/netiperher"><img src="https://avatars.githubusercontent.com/u/45091747?v=4?s=100" width="100px;" alt="Per Hermansson"/><br /><sub><b>Per Hermansson</b></sub></a><br /><a href="https://github.com/ts-rest/ts-rest/commits?author=netiperher" title="Documentation">📖</a> <a href="https://github.com/ts-rest/ts-rest/commits?author=netiperher" title="Code">💻</a></td>
      <td align="center"><a href="https://ghoullier.deno.dev/"><img src="https://avatars.githubusercontent.com/u/2315749?v=4?s=100" width="100px;" alt="Grégory Houllier"/><br /><sub><b>Grégory Houllier</b></sub></a><br /><a href="https://github.com/ts-rest/ts-rest/commits?author=ghoullier" title="Documentation">📖</a></td>
      <td align="center"><a href="http://michaelangrivera.com"><img src="https://avatars.githubusercontent.com/u/55844504?v=4?s=100" width="100px;" alt="Michael Angelo "/><br /><sub><b>Michael Angelo </b></sub></a><br /><a href="https://github.com/ts-rest/ts-rest/commits?author=michaelangrivera" title="Documentation">📖</a></td>
      <td align="center"><a href="https://pieter.venter.pro"><img src="https://avatars.githubusercontent.com/u/1845861?v=4?s=100" width="100px;" alt="Pieter Venter"/><br /><sub><b>Pieter Venter</b></sub></a><br /><a href="https://github.com/ts-rest/ts-rest/commits?author=cyrus-za" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
