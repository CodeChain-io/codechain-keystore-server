import { Model, snakeCaseMappers } from "objection";

export default class KeyModel extends Model {
    public static columnNameMappers = snakeCaseMappers();

    public static tableName = "keys";
    public static idColumn = ["type", "address"];
    public readonly type!: "asset" | "platform";
    public readonly address!: string;
    public readonly version!: number;

    public readonly kdf!: string;
    public readonly kdfparams?: any;
    public readonly mac!: string;

    public readonly cipher!: string;
    public readonly cipherparams?: any;
    public readonly ciphertext!: string;

    public readonly meta!: any;
}
