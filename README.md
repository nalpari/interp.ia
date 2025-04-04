# get user data

### client side component

```
const cache = useQueryClient()
const data = cache.getQueryData(['user', 'info']) as UserState
```

Navbar 컴포넌트에서 최초 진입시 ['user', 'info'] 라는 키로 캐싱이 되어서
다시 호출하거나 zustand 상태저장 할 필요없이 캐싱된 데이터를 직접 불러올 수 있다.

### server side component

```
import { getUser } from '@/api/user'

const cookieStore = await cookies()
const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
const data = getUser(session.email)
```

많이 사용할것 같진 않지만...
만약에 많이 사용하게 된다면 좀더 편한 케이스로 변경하도록 하겠습니다.
