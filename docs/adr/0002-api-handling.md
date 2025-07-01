# 1. ADR: Migration from Fetch API to Axios for API Transmission

Date: 2025-07-01

## Status

Implemented

## Context

The project previously used the Fetch API for HTTP requests. The codebase now uses Axios (see inji-web/src/hooks/useApi.ts), leveraging its features for API calls, error handling, and interceptors.

## Decision

Adopt Axios as the standard HTTP client for all API transmissions in the frontend codebase.

## Consequences

**Pros:**
* Unified API request handling with Axios.
* Simplified request/response interceptors (see useInterceptor.ts).
* Enhanced error handling and response parsing.
* Built-in support for request cancellation, timeouts, and automatic JSON transformation.
* Consistent configuration (base URL, credentials, headers) via Axios instances.

**Cons:**
* Adds Axios as a project dependency.
* Requires refactoring legacy code using Fetch.

### Implementation Approach

* [inji-web/src/hooks/useApi.ts](../../inji-web/src/hooks/useApi.ts) - hook to handle API requests using Axios.
* [inji-web/src/hooks/useInterceptor.ts](../../inji-web/src/hooks/useInterceptor.ts) - hook to manage request/response interceptors.

## References
* [Axios Documentation](https://axios-http.com/docs/intro)
* [Fetch API MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
