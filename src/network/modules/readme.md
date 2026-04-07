# createApiMutation Documentation

## Overview

The `createApiMutation` function is a factory function that creates reusable API mutation hooks. It provides a way to create type-safe, pre-configured mutation hooks that can be used throughout the application. This is particularly useful for creating consistent API interactions with shared configuration.

## Basic Usage

```typescript
// Define the mutation hook
const useCreateUser = createApiMutation<UserData, UserResponse>({
  endpoint: "/api/users",
  operationName: "CreateUser",
  successMessage: "User created successfully",
});

// Usage in a component
const { mutate, isLoading } = useCreateUser();
```

## Configuration Options

### Required Properties

- `endpoint` (string): The API endpoint to send the request to
- `operationName` (string): Name of the operation for logging purposes

### Optional Properties

- `method` ('post' | 'put' | 'delete' | 'patch'): HTTP method to use (defaults to 'post')
- `transformRequest` (function): Transform request data before sending
- `transformResponse` (function): Transform response data after receiving
- `getHeaders` (function): Generate custom headers for the request
- `getContextData` (function): Get additional context data for logging
- `successMessage` (string | function): Message to show on success
- `suppressSuccessMessage` (boolean): Prevent showing success message
- `suppressErrorMessage` (boolean): Prevent showing error message
- `invalidateQueries` (QueryKey[][]): Queries to invalidate after success
- `onSuccess` (function): Custom success handler

## Example Implementations

### Basic User Creation Hook

```typescript
interface UserData {
  name: string;
  email: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

const useCreateUser = createApiMutation<UserData, UserResponse>({
  endpoint: "/api/users",
  operationName: "CreateUser",
  successMessage: "User created successfully",
});

// Usage
const { mutate, isLoading } = useCreateUser();
mutate({ name: "John", email: "john@example.com" });
```

### File Upload Hook with Custom Headers

```typescript
interface UploadData {
  file: File;
  metadata?: Record<string, any>;
}

const useUploadFile = createApiMutation<UploadData, { url: string }>({
  endpoint: "/api/upload",
  operationName: "UploadFile",
  method: "post",
  getHeaders: (variables) => ({
    "Content-Type": "multipart/form-data",
  }),
  transformRequest: (variables) => {
    const formData = new FormData();
    formData.append("file", variables.file);
    if (variables.metadata) {
      formData.append("metadata", JSON.stringify(variables.metadata));
    }
    return formData;
  },
});

// Usage
const { mutate, isLoading } = useUploadFile();
mutate({ file: fileObject, metadata: { type: "document" } });
```

### Protected API Hook with Query Invalidation

```typescript
interface ProtectedData {
  token: string;
  data: any;
}

const useProtectedOperation = createApiMutation<ProtectedData, any>({
  endpoint: "/api/protected",
  operationName: "ProtectedOperation",
  method: "post",
  getHeaders: (variables) => ({
    Authorization: `Bearer ${variables.token}`,
  }),
  transformRequest: (variables) => variables.data,
  invalidateQueries: [["users"], ["users", "details"]],
  onSuccess: (variables, data) => {
    // Custom success handling
    console.log("Operation successful:", data);
  },
});
```

## TypeScript Support

The factory function is fully typed and supports generic types for both variables and response data:

```typescript
// Define types
interface RequestData {
  // ... request data structure
}

interface ResponseData {
  // ... response data structure
}

// Create typed mutation hook
const useTypedMutation = createApiMutation<RequestData, ResponseData>({
  endpoint: "/api/endpoint",
  operationName: "TypedOperation",
});
```

## Best Practices

1. Create reusable mutation hooks for common API operations
2. Use TypeScript generics for better type safety
3. Provide meaningful operation names for better error tracking
4. Include appropriate success messages for user feedback
5. Use transformRequest/transformResponse for data manipulation
6. Configure query invalidation when data changes affect other queries
7. Handle loading states in your UI components
8. Group related mutation hooks in separate files by feature or domain
9. Use suppressSuccessMessage/suppressErrorMessage when you want to handle messages differently
10. Implement custom onSuccess handlers when needed

## Error Handling

The created mutation hooks automatically handle errors and display them using the application's message system. Errors are logged with the operation name and any provided context data. The error message can be suppressed using the `suppressErrorMessage` option.

## Success Handling

On successful mutation:

1. The success message is displayed (if not suppressed)
2. The custom onSuccess handler is called (if provided)
3. Specified queries are invalidated (if any)
4. The callback function is executed (if provided)

## Creating Custom Hooks

You can create custom hooks that wrap the created mutation hooks for additional functionality:

```typescript
const useCreateUserWithValidation = () => {
  const createUser = useCreateUser();

  const createUserWithValidation = (data: UserData) => {
    // Add validation logic
    if (!data.email.includes("@")) {
      throw new Error("Invalid email");
    }
    return createUser.mutate(data);
  };

  return {
    ...createUser,
    mutate: createUserWithValidation,
  };
};
```

# createApiQuery Documentation

## Overview

The `createApiQuery` function is a factory function that creates reusable API query hooks. It provides a way to create type-safe, pre-configured query hooks that can be used throughout the application. This is particularly useful for creating consistent API data fetching with shared configuration.

## Basic Usage

```typescript
// Define the query hook
const useGetUsers = createApiQuery<QueryParams, UserData[]>({
  endpoint: "/api/users",
  queryKey: ["users"],
  operationName: "GetUsers",
});

// Usage in a component
const { data, isLoading } = useGetUsers({ page: 1, limit: 10 });
```

## Configuration Options

### Required Properties

- `endpoint` (string | function): The API endpoint to fetch data from. Can be a static string or a function that generates the endpoint based on parameters
- `queryKey` (QueryKey): The query key used for caching and deduplication
- `operationName` (string): Name of the operation for logging purposes

### Optional Properties

- `transformResponse` (function): Transform response data after receiving
- `getHeaders` (function): Generate custom headers for the request
- `getContextData` (function): Get additional context data for logging
- `enabled` (function): Determine if the query should be enabled based on parameters

## Example Implementations

### Basic Data Fetching Hook

```typescript
interface QueryParams {
  page: number;
  limit: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

const useGetUsers = createApiQuery<QueryParams, UserData[]>({
  endpoint: "/api/users",
  queryKey: ["users"],
  operationName: "GetUsers",
});

// Usage
const { data, isLoading } = useGetUsers({ page: 1, limit: 10 });
```

### Dynamic Endpoint Hook

```typescript
interface UserParams {
  userId: string;
}

const useGetUser = createApiQuery<UserParams, UserData>({
  endpoint: (params) => `/api/users/${params.userId}`,
  queryKey: ["user"],
  operationName: "GetUser",
});

// Usage
const { data, isLoading } = useGetUser({ userId: "123" });
```

### With Response Transformation

```typescript
const useGetProcessedData = createApiQuery<{}, ProcessedData>({
  endpoint: "/api/data",
  queryKey: ["data"],
  operationName: "GetData",
  transformResponse: (response) => ({
    ...response,
    processed: true,
  }),
});

// Usage
const { data, isLoading } = useGetProcessedData({});
```

### With Custom Headers

```typescript
interface ProtectedParams {
  token: string;
}

const useGetProtectedData = createApiQuery<ProtectedParams, ProtectedData>({
  endpoint: "/api/protected",
  queryKey: ["protected"],
  operationName: "GetProtectedData",
  getHeaders: (params) => ({
    Authorization: `Bearer ${params.token}`,
  }),
});

// Usage
const { data, isLoading } = useGetProtectedData({ token: "auth-token" });
```

### With Conditional Fetching

```typescript
interface ConditionalParams {
  shouldFetch: boolean;
}

const useGetConditionalData = createApiQuery<ConditionalParams, Data>({
  endpoint: "/api/data",
  queryKey: ["data"],
  operationName: "GetData",
  enabled: (params) => params.shouldFetch,
});

// Usage
const { data, isLoading } = useGetConditionalData({ shouldFetch: true });
```

## TypeScript Support

The factory function is fully typed and supports generic types for both parameters and response data:

```typescript
// Define types
interface QueryParams {
  // ... query parameters structure
}

interface ResponseData {
  // ... response data structure
}

// Create typed query hook
const useTypedQuery = createApiQuery<QueryParams, ResponseData>({
  endpoint: "/api/endpoint",
  queryKey: ["resource"],
  operationName: "TypedOperation",
});
```

## Best Practices

1. Create reusable query hooks for common API operations
2. Use TypeScript generics for better type safety
3. Provide meaningful operation names for better error tracking
4. Use transformResponse when you need to modify the response data structure
5. Use getHeaders for authentication and other dynamic headers
6. Use enabled to conditionally fetch data
7. Handle loading states appropriately in your UI
8. Use meaningful query keys for better cache management
9. Group related query hooks in separate files by feature or domain

## Error Handling

The created query hooks automatically handle errors and display them using the application's message system. Errors are logged with the operation name and any provided context data.

## Query Options

The created hooks accept standard React Query options as a second parameter:

```typescript
const useGetData = createApiQuery<Params, Data>({
  endpoint: "/api/data",
  queryKey: ["data"],
  operationName: "GetData",
});

// Usage with query options
const { data, isLoading } = useGetData(
  {
    /* query parameters */
  },
  {
    // React Query options
    refetchOnWindowFocus: false,
    staleTime: 30000,
    cacheTime: 60000,
  }
);
```

## Creating Custom Hooks

You can create custom hooks that wrap the created query hooks for additional functionality:

```typescript
const useUserDataWithComputed = (userId: string) => {
  const { data, isLoading, error } = useGetUser({ userId });

  return {
    user: data,
    isLoading,
    error,
    // Add custom computed properties or methods
    isActive: data?.status === "active",
    fullName: data ? `${data.firstName} ${data.lastName}` : "",
  };
};
```

# createPaginatedApiQuery Documentation

## Overview

The `createPaginatedApiQuery` function is a factory function that creates reusable paginated API query hooks. It provides a way to create type-safe, pre-configured infinite query hooks that can be used throughout the application for handling paginated data. This is particularly useful for implementing infinite scrolling or paginated data tables.

## Basic Usage

```typescript
// Define the paginated query hook
const useGetPaginatedUsers = createPaginatedApiQuery<QueryParams, UserData>({
  endpoint: "/api/users",
  queryKey: ["users"],
  operationName: "GetPaginatedUsers",
});

// Usage in a component
const { data, fetchNextPage, hasNextPage, isLoading } = useGetPaginatedUsers({
  page: 1,
  limit: 10,
});
```

## Configuration Options

### Required Properties

- `endpoint` (string | function): The API endpoint to fetch data from. Can be a static string or a function that generates the endpoint based on parameters
- `queryKey` (QueryKey): The query key used for caching and deduplication
- `operationName` (string): Name of the operation for logging purposes

### Optional Properties

- `pageParamKey` (string): The query parameter key used for pagination (defaults to 'page')
- `dataField` (string): The field in the response that contains the items array (defaults to 'recipients')
- `transformResponse` (function): Transform individual items in the response
- `getHeaders` (function): Generate custom headers for the request
- `getContextData` (function): Get additional context data for logging
- `enabled` (function): Determine if the query should be enabled based on parameters

## Example Implementations

### Basic Paginated Data Fetching

```typescript
interface QueryParams {
  page: number;
  limit: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

const useGetPaginatedUsers = createPaginatedApiQuery<QueryParams, UserData>({
  endpoint: "/api/users",
  queryKey: ["users"],
  operationName: "GetPaginatedUsers",
});

// Usage
const { data, fetchNextPage, hasNextPage, isLoading } = useGetPaginatedUsers({
  page: 1,
  limit: 10,
});
```

### With Custom Page Parameter

```typescript
const useGetPaginatedItems = createPaginatedApiQuery<QueryParams, ItemData>({
  endpoint: "/api/items",
  queryKey: ["items"],
  operationName: "GetPaginatedItems",
  pageParamKey: "pageNumber", // Custom page parameter name
  dataField: "items", // Custom data field name
});

// Usage
const { data, fetchNextPage } = useGetPaginatedItems({
  pageNumber: 1,
  limit: 20,
});
```

### With Response Transformation

```typescript
const useGetProcessedPaginatedData = createPaginatedApiQuery<{}, ProcessedData>(
  {
    endpoint: "/api/data",
    queryKey: ["data"],
    operationName: "GetPaginatedData",
    transformResponse: (item) => ({
      ...item,
      processed: true,
    }),
  }
);

// Usage
const { data, fetchNextPage } = useGetProcessedPaginatedData({});
```

## Response Structure

The paginated query returns data in the following structure:

```typescript
interface PaginatedResult<T> {
  items: T[];
  nextPage: number;
  totalPages: number | null;
  totalItems: number | null;
  currentPage: number;
  pageSize: number | null;
}
```

## Best Practices

1. Use for infinite scrolling or paginated data tables
2. Implement proper loading states and error handling
3. Use meaningful query keys for better cache management
4. Consider implementing a "Load More" button or infinite scroll trigger
5. Handle empty states and loading states appropriately
6. Use transformResponse when you need to modify individual items
7. Consider implementing prefetching for better user experience
8. Use the hasNextPage flag to control when to show loading states

## Example Implementation with Infinite Scroll

```typescript
function PaginatedList() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useGetPaginatedUsers({
    page: 1,
    limit: 10,
  })

  const allItems = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div>
      {allItems.map((item) => (
        <Item key={item.id} data={item} />
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

## Error Handling

The created paginated query hooks automatically handle errors and display them using the application's message system. Errors are logged with the operation name and any provided context data.

## Query Options

The created hooks accept standard React Query infinite query options as a second parameter:

```typescript
const useGetPaginatedData = createPaginatedApiQuery<Params, Data>({
  endpoint: "/api/data",
  queryKey: ["data"],
  operationName: "GetPaginatedData",
});

// Usage with query options
const { data, fetchNextPage } = useGetPaginatedData(
  {
    /* query parameters */
  },
  {
    // React Query infinite query options
    refetchOnWindowFocus: false,
    staleTime: 30000,
    cacheTime: 60000,
  }
);
```

## Creating Custom Hooks

You can create custom hooks that wrap the created paginated query hooks for additional functionality:

```typescript
const usePaginatedDataWithComputed = (params: QueryParams) => {
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useGetPaginatedData(params);

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];
  const totalItems = data?.pages[0]?.totalItems ?? 0;

  return {
    items: allItems,
    totalItems,
    fetchNextPage,
    hasNextPage,
    isLoading,
    // Add custom computed properties
    isEmpty: allItems.length === 0,
    isComplete: !hasNextPage,
  };
};
```

# createPaginatedApiResponse Documentation

## Overview

The `createPaginatedApiResponse` function is a factory function that creates reusable API query hooks specifically designed for handling paginated API responses. Unlike `createPaginatedApiQuery`, this function is optimized for traditional pagination where you need to fetch specific pages rather than infinite scrolling.

## Basic Usage

```typescript
// Define the paginated response hook
const useGetPaginatedUsers = createPaginatedApiResponse<QueryParams, UserData>({
  endpoint: "/api/users",
  queryKey: ["users"],
  operationName: "GetPaginatedUsers",
});

// Usage in a component
const { data, isLoading } = useGetPaginatedUsers({ page: 1, limit: 10 });
```

## Configuration Options

### Required Properties

- `endpoint` (string | function): The API endpoint to fetch data from. Can be a static string or a function that generates the endpoint based on parameters
- `queryKey` (QueryKey): The query key used for caching and deduplication
- `operationName` (string): Name of the operation for logging purposes

### Optional Properties

- `transformResponse` (function): Transform response data after receiving
- `getHeaders` (function): Generate custom headers for the request
- `getContextData` (function): Get additional context data for logging
- `enabled` (function): Determine if the query should be enabled based on parameters

## Example Implementations

### Basic Paginated Response Hook

```typescript
interface QueryParams {
  page: number;
  limit: number;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

const useGetPaginatedUsers = createPaginatedApiResponse<QueryParams, UserData>({
  endpoint: "/api/users",
  queryKey: ["users"],
  operationName: "GetPaginatedUsers",
});

// Usage
const { data, isLoading } = useGetPaginatedUsers({ page: 1, limit: 10 });
```

### With Response Transformation

```typescript
const useGetProcessedPaginatedData = createPaginatedApiResponse<
  {},
  ProcessedData
>({
  endpoint: "/api/data",
  queryKey: ["data"],
  operationName: "GetPaginatedData",
  transformResponse: (response) => ({
    ...response,
    processed: true,
  }),
});

// Usage
const { data, isLoading } = useGetProcessedPaginatedData({});
```

### With Custom Headers

```typescript
interface ProtectedParams {
  token: string;
}

const useGetProtectedPaginatedData = createPaginatedApiResponse<
  ProtectedParams,
  ProtectedData
>({
  endpoint: "/api/protected",
  queryKey: ["protected"],
  operationName: "GetProtectedPaginatedData",
  getHeaders: (params) => ({
    Authorization: `Bearer ${params.token}`,
  }),
});

// Usage
const { data, isLoading } = useGetProtectedPaginatedData({
  token: "auth-token",
});
```

## Response Structure

The paginated response returns data in the following structure:

```typescript
interface PaginatedResult<T> {
  items: T[];
  nextPage: number;
  totalPages: number | null;
  totalItems: number | null;
  currentPage: number;
  pageSize: number | null;
}
```

## Best Practices

1. Use for traditional pagination where you need to fetch specific pages
2. Implement proper loading states and error handling
3. Use meaningful query keys for better cache management
4. Consider implementing page navigation controls
5. Handle empty states and loading states appropriately
6. Use transformResponse when you need to modify the response data
7. Consider implementing prefetching for better user experience
8. Use the totalPages and currentPage information for pagination UI

## Example Implementation with Page Navigation

```typescript
function PaginatedList() {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading } = useGetPaginatedUsers({
    page: currentPage,
    limit: 10,
  })

  return (
    <div>
      {data?.items.map((item) => (
        <Item key={item.id} data={item} />
      ))}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {data?.totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage === data?.totalPages || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## Error Handling

The created paginated response hooks automatically handle errors and display them using the application's message system. Errors are logged with the operation name and any provided context data.

## Query Options

The created hooks accept standard React Query options as a second parameter:

```typescript
const useGetPaginatedData = createPaginatedApiResponse<Params, Data>({
  endpoint: "/api/data",
  queryKey: ["data"],
  operationName: "GetPaginatedData",
});

// Usage with query options
const { data, isLoading } = useGetPaginatedData(
  {
    /* query parameters */
  },
  {
    // React Query options
    refetchOnWindowFocus: false,
    staleTime: 30000,
    cacheTime: 60000,
  }
);
```

## Creating Custom Hooks

You can create custom hooks that wrap the created paginated response hooks for additional functionality:

```typescript
const usePaginatedDataWithComputed = (params: QueryParams) => {
  const { data, isLoading } = useGetPaginatedData(params);

  return {
    items: data?.items ?? [],
    totalItems: data?.totalItems ?? 0,
    currentPage: data?.currentPage ?? 1,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    // Add custom computed properties
    isEmpty: data?.items.length === 0,
    isLastPage: data?.currentPage === data?.totalPages,
  };
};
```

## Comparison with createPaginatedApiQuery

While both `createPaginatedApiResponse` and `createPaginatedApiQuery` handle paginated data, they serve different purposes:

- `createPaginatedApiResponse`: Best for traditional pagination where you need to fetch specific pages and show page navigation
- `createPaginatedApiQuery`: Best for infinite scrolling or "Load More" functionality where you want to accumulate data

Choose the appropriate function based on your UI requirements and pagination strategy.
