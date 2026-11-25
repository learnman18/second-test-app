export const storeKeys = {
  all: ['stores'] as const,

  lists: () => [...storeKeys.all, 'list'] as const,

  list: (filters?: object) =>
    [...storeKeys.lists(), filters] as const,

  details: () => [...storeKeys.all, 'detail'] as const,

  detail: (id: number) =>
    [...storeKeys.details(), id] as const,
};

/*
Let's understand the structure.

all	--> All store-related queries
lists() --> 	All store list queries
list(filters) --> A particular list or filtered result
details()	--> All individual store detail queries
detail(id) -->	Details of a particular store

For Example - 

storeKeys.all
// ['stores']

storeKeys.lists()
// ['stores', 'list']

storeKeys.list({ page: 1 })
// ['stores', 'list', { page: 1 }]

storeKeys.detail(10)
// ['stores', 'detail', 10]
*/