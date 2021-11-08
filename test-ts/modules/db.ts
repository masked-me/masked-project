
interface DBI<T> {
    add(info: T): boolean;
    updata(info: T, id: number): boolean
}

export class MysqlDb<T> implements DBI<T> {
    add(info: T): boolean {
        console.log(info)
        return true
    }
    updata(info: T, id: number): boolean {
        console.log(info)
        console.log(id)
        return true
    }
}
