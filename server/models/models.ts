import {
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyAddAssociationsMixin,
    HasManyGetAssociationsMixin,
    HasManySetAssociationsMixin,
    Model,
    Optional,
} from "sequelize";
import sequelizeConnection from "../db";
import {STATUS} from "../dto/order.dto";
import {ROLES} from "../dto/global";

interface CityAttributes {
    id: number;
    name: string;
    price: number;
    masters?: Array<Master>;
}

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: ROLES
    isActivated?: boolean;
    activationLink?: string;
    master?: { name: string, orders?: Array<Order>, id?: number };
    customer?: { name: string };
    customerId?: number;
    masterId?: number;
    facebookId?: number;
    orders?: Array<Order>;

}

interface CitiesMastersAttributes {
    id: number;
    cityId?: number;
    masterId?: number;
}

interface CustomerAttributes {
    id: number;
    name: string;
    userId?: number;

}

interface MasterAttributes {
    id: number;
    name: string;
    rating: number;
    isActivated: boolean;
    orders?: Array<Order>;
    userId?: number;
    user?: User;
}

interface RatingAttributes {
    id: number;
    rating: number;
    review?: string;
    orderId?: number;
    masterId?: number;
    userId?: number;

}

interface SizeClockAttributes {
    id: number;
    name: string;
    date: string;
    orders?: Array<Order>;
}


interface OrderAttributes {
    id: number;
    name: string;
    time: Date;
    endTime: Date;
    status?: STATUS | undefined | string
    price: number;
    sizeClockId?: number;
    masterId?: number;
    cityId: number;
    userId?: number;
    payPalId?: string | null
    user?: User;
    ratingLink?: string | null
    photoLinks?: Array<string>
    city?: City
    master?: Master
    sizeClock?: SizeClock
}

export interface CityInput extends Optional<CityAttributes, 'id'> {
}

export interface CityOutput extends Required<CityAttributes> {
}

class City extends Model<CityAttributes, CityInput>
    implements CityAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public masters?: Array<Master>;
}

export interface CitiesMastersInput extends Optional<CitiesMastersAttributes, 'id'> {
}

export interface CitiesMastersOutput extends Required<CitiesMastersAttributes> {
}

class CitiesMasters extends Model<CitiesMastersAttributes, CitiesMastersInput>
    implements CitiesMastersAttributes {
    public id!: number;
    public cityId!: number;
    public masterId!: number;
}

export interface CustomerInput extends Optional<CustomerAttributes, 'id'> {
}

export interface CustomerOutput extends Required<CustomerAttributes> {
}

class Customer extends Model<CustomerAttributes, CustomerInput>
    implements CustomerAttributes {
    public id!: number;
    public name!: string;
    public userId?: number;

}

export interface MasterInput extends Optional<MasterAttributes, 'id'> {
}

export interface MasterOutput extends Required<MasterAttributes> {
}

class Master extends Model<MasterAttributes, MasterInput>
    implements MasterAttributes {
    public id!: number;
    public name!: string;
    public rating!: number;
    public isActivated!: boolean;
    public userId!: number;
    public orders?: Array<Order>;
    public user?: User;
    public addCities!: HasManyAddAssociationsMixin<City, number>;
    public setCities!: HasManySetAssociationsMixin<City, number>;
}

export interface OrderInput extends Optional<OrderAttributes, 'id'> {
}

export interface OrderOutput extends Required<OrderAttributes> {
}

class Order extends Model<OrderAttributes, OrderInput>
    implements OrderAttributes {
    public id!: number;
    public name!: string;
    public time!: Date;
    public endTime!: Date;
    public status?: STATUS | undefined | string
    public price!: number;
    public sizeClockId?: number;
    public masterId?: number;
    public cityId!: number;
    public userId?: number;
    public user?: User;
    public ratingLink?: string | null
    public rating!: Rating | null
    public payPalId?: string | null
    public photoLinks?: Array<string>
    public city?: City
    public master?: Master
    public sizeClock?: SizeClock
}

export interface RatingInput extends Optional<RatingAttributes, 'id'> {
}

export interface RatingOutput extends Required<RatingAttributes> {
}

class Rating extends Model<RatingAttributes, RatingInput>
    implements RatingAttributes {
    public id!: number;
    public rating!: number;
    public review?: string;
    public orderId!: number;
    public masterId!: number;
    public userId!: number;
    public addMaster!: HasManyAddAssociationMixin<Master, number>;
}

export interface SizeClockInput extends Optional<SizeClockAttributes, 'id'> {
}

export interface SizeClockOutput extends Required<SizeClockAttributes> {
}

class SizeClock extends Model<SizeClockAttributes, SizeClockInput>
    implements SizeClockAttributes {
    public id!: number;
    public name!: string;
    public date!: string;
    public orders?: Array<Order>;
}

export interface UserInput extends Optional<UserAttributes, 'id' | "password" | "role"> {
}

export interface UserOutput extends Required<UserAttributes> {
}

class User extends Model<UserAttributes, UserInput>
    implements UserAttributes {
    public id!: number;
    public email!: string;
    public password!: string;
    public role!: ROLES
    public isActivated?: boolean;
    public master?: { name: string, orders?: Array<Order>, id?: number };
    public customer?: { name: string };
    public readonly activationLink?: string;
    public orders?: Array<Order>;
    declare customerId?: number;
    declare masterId?: number;
    declare token?: string;
    declare facebookId?: number;
    declare getCustomer: HasManyGetAssociationsMixin<Customer>;
    declare getMaster: HasManyGetAssociationsMixin<Master>;
}

CitiesMasters.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        tableName: 'cities_masters',
        modelName: 'cities_masters',
        sequelize: sequelizeConnection,
        timestamps: false
    })
City.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {notEmpty: true}
        },
        price: {type: DataTypes.INTEGER}
    },
    {
        tableName: 'cities',
        modelName: 'city',
        sequelize: sequelizeConnection,
        timestamps: false
    })

User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
        role: {type: DataTypes.ENUM(ROLES.ADMIN, ROLES.CUSTOMER, ROLES.MASTER), defaultValue: ROLES.CUSTOMER},
        activationLink: {type: DataTypes.STRING},
        facebookId: {type: DataTypes.BIGINT, unique: true, defaultValue: null}
    },
    {
        tableName: 'users',
        modelName: 'user',
        sequelize: sequelizeConnection,
        timestamps: false
    })

Customer.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, allowNull: false,
            validate: {notEmpty: true}
        },
    },
    {
        tableName: 'customers',
        modelName: 'customer',
        sequelize: sequelizeConnection,
        timestamps: false
    })

Master.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, allowNull: false,
            validate: {notEmpty: true}
        },
        rating: {
            type: DataTypes.DOUBLE, allowNull: false,
            validate: {
                min: 0,
                max: 5
            }, defaultValue: 0
        },
        isActivated: {type: DataTypes.BOOLEAN, defaultValue: false}
    },
    {
        tableName: 'masters',
        modelName: 'master',
        sequelize: sequelizeConnection,
        timestamps: false
    })
SizeClock.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {notEmpty: true}
        },
        date: {type: DataTypes.TIME}
    },
    {
        tableName: 'sizeClocks',
        modelName: 'sizeClock',
        sequelize: sequelizeConnection,
        timestamps: false
    })

Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            validate: {
                notEmpty: true,
                len: [3, 30]
            }
        },
        cityId: {
            type: DataTypes.INTEGER,
            references: {
                model: City,
                key: 'id'
            }
        },
        time: {type: DataTypes.DATE,},
        endTime: {type: DataTypes.DATE},
        status: {
            type: DataTypes.ENUM(STATUS.WAITING, STATUS.REJECTED, STATUS.ACCEPTED, STATUS.DONE),
            defaultValue: STATUS.WAITING
        },
        price: {type: DataTypes.INTEGER},
        ratingLink: {type: DataTypes.STRING},
        photoLinks: {type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: null},
        payPalId: {type: DataTypes.STRING, defaultValue: null},
    },

    {
        tableName: 'orders',
        modelName: 'order',
        sequelize: sequelizeConnection,
        timestamps: false
    })

Rating.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rating: {
            type: DataTypes.DOUBLE, allowNull: false,
            validate: {
                min: 0,
                max: 5
            }, defaultValue: 0
        },
        review: {type: DataTypes.TEXT, allowNull: true}
    },
    {
        tableName: 'rating',
        modelName: 'rating',
        sequelize: sequelizeConnection,
        timestamps: false
    })
Master.hasMany(Order, {
    foreignKey: 'masterId'
})
Order.belongsTo(Master, {
    foreignKey: 'masterId'
})

Master.hasMany(Rating, {onDelete: 'CASCADE', foreignKey: 'masterId'})
Rating.belongsTo(Master, {
    foreignKey: 'masterId'

})

Master.belongsToMany(City, {through: CitiesMasters, foreignKey: 'cityId'})
City.belongsToMany(Master, {through: CitiesMasters, foreignKey: 'masterId'})

City.hasMany(Order, {foreignKey: 'cityId'})
Order.belongsTo(City, {foreignKey: 'cityId'})

User.hasOne(Rating, {
    foreignKey: 'userId'
})
Rating.belongsTo(User, {
    foreignKey: 'userId'
})

User.hasMany(Order, {
    foreignKey: 'userId'
})
Order.belongsTo(User, {
    foreignKey: 'userId'
})


User.hasOne(Customer, {
    foreignKey: 'userId'
})
Customer.belongsTo(User, {
    foreignKey: 'userId'
})

User.hasOne(Master, {
    onDelete: 'CASCADE', foreignKey: 'userId'

},)
Master.belongsTo(User, {onDelete: 'CASCADE', foreignKey: 'userId'})
Order.hasOne(Rating, {onDelete: 'CASCADE', foreignKey: 'orderId'})
Rating.belongsTo(Order, {
    foreignKey: 'orderId'
})
SizeClock.hasMany(Order, {
    foreignKey: 'sizeClockId'
})
Order.belongsTo(SizeClock, {
    foreignKey: 'sizeClockId'
})


export {
    CitiesMasters,
    City,
    Order,
    Master,
    Customer,
    Rating,
    SizeClock,
    User
}