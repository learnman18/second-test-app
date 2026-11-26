export const storeKeys = {
  //Root key. Matches all store-related queries.
  all: ['stores'] as const,

  // Groups list queries for a particular user.
  lists: (userId: number) => [...storeKeys.all, 'list', userId] as const,
  //lists(userId) => [...storeKeys.all , 'list', userId]

  // dentifies a particular filtered or paginated list.
  list: (userId: number, filters?: object) => [...storeKeys.lists(userId), filters] as const,

  // Groups individual store-detail queries for a user.
  details: (userId: number) => [...storeKeys.all, 'detail', userId] as const,

  // Identifies one specific store's details.
  detail: (userId: number, id: number) => [...storeKeys.details(userId), id] as const,
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