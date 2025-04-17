import mongoose, { mongo } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface INew {
    title: string;
    body: string;
    coverImage?: string | null;
    officialSource?: string | null;
    views: number;
    createdBy: mongoose.Types.ObjectId;
    likes: number;
    likedBy: mongoose.Types.ObjectId[];
    numComments: number;
    comments: mongoose.Types.ObjectId[];
    tags: mongoose.Types.ObjectId[];
    approved: boolean;
    editing: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    spoiler: boolean;
}

const newSchema = new mongoose.Schema<INew>(
    {
        title:{
            type: String,
            required: true
        },
        body:{
            type: String,
        },
        coverImage:{
            type: String, //TODO: URL de la imagen
            default: 'uploads/news/default/default.png'
        },
        officialSource:{
            type: String
        },
        views:{
            type: Number,
            default: 0
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            // type: mongoose.Types.ObjectId,
            required: true,
            ref: 'users'
        },
        likes:{
            type: Number,
            default:0
        },
        likedBy:{
            type: [mongoose.Types.ObjectId],
            ref: 'users'
        },
        //TODO: de momento solo va a ser like a la noticia
        // dislikes:{
        //     type: Number,
        //     default:0
        // },
        // dislikedBy:{
        //     type: [mongoose.Types.ObjectId],
        //     ref: 'users'
        // },
        numComments:{
            type: Number,
            default: 0
        },
        comments: {
            type: [mongoose.Types.ObjectId],
            ref: 'comments'

        },
        tags: {
            type: [mongoose.Types.ObjectId],
            ref: 'tags'

        },
        approved:{
            type: Boolean,
            default: false
        },
        editing:{
            type: Boolean,
            default: true
        },
        spoiler:{
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)
//TODO: añadir los campos en BBDD (es problable no haya que hacerlo, el dislike se esta valorando)

//v1-alpha.1.0 => cambiar approved, editing to states y hacer un enum de los estados

newSchema.plugin(paginate);

interface INewModel<T> extends mongoose.PaginateModel<T> {}

const NewModel = mongoose.model<INew, INewModel<INew>>('New', newSchema, 'news'); //FIXME: si hay algun problema con las noticias, esto se ha cambiado (antes: no muy correcto => mongoose.model('news', newModel))
export default NewModel;