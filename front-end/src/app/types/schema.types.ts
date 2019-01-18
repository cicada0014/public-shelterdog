import { SafeUrl } from "@angular/platform-browser";

export interface VendingMachineItemCommentsAttribute {
    id?: number;
    item_id?: number;
    user_id?: number;
    content?: string;
    parent?: number;
    mention_id?: number;
    status_code?: number;
    created_at?: any;
    updated_at?: any;
    isUpdate?: boolean;
    UserProfile?: UserProfilesAttribute

}


export interface HashTagsAttribute {
    id?: number;
    name?: string
}


export interface VendingMachineItemHashTagsAttribute {
    item_id?: number;
    tag_id?: number;
    HashTag?: HashTagsAttribute
    representation?: number
}
export interface VendingMachineItemPagesAttribute {
    id?: number;
    item_id: number;
    url: string;
    meta?: string;
    created_at?: any;
    updated_at?: any;
}


export interface VendingMachineItemsAttribute {
    id?: number;
    category_id: number;
    title: string;
    thumbnail: string;
    script: string;
    meta?: string;
    hit?: number;
    active?: number | null;
    VendingMachineItemComments?: VendingMachineItemCommentsAttribute[];
    VendingMachineItemHashTags?: VendingMachineItemHashTagsAttribute[];
    VendingMachineItemPages?: VendingMachineItemPagesAttribute[];
    GraphObject?: GraphObjectsAttribute
    created_at?: any;
    updated_at?: any;
    meEdge?: GraphEdgesAttribute;
}

export interface UsersAttribute {
    id?: number;
    email?: string;
    pw?: string;
    status?: 'ACT' | 'DEL' | 'PRE' | 'CRO';
    isAdmin?: boolean;
    created_at?: any;

}

export interface BannerItemsAttribute {
    id?: number;
    area_id?: number;
    image_url?: string;
    active?: boolean;
    target?: string;
    priority?: number;
}

export interface BannerAreasAttribute {
    id?: number;
    width?: number;
    height?: number;
    name?: string;
    akey?: string;
    BannerItems?: BannerItemsAttribute[]
}
export interface GraphEdgesAttribute {
    id?: number;
    type?: string;
    from?: number;
    to?: number;
    GraphObject?: GraphObjectsAttribute

}
export interface GraphObjectsAttribute {
    id?: number;
    type?: string;
    ref_id?: number;
    GraphEdges?: GraphEdgesAttribute[]

}
export interface NoticesAttribute {
    id?: number;
    title?: string;
    content?: string;
    status?: string;
    priority?: number;
    meta?: string;
    created_at?: any;
    updated_at?: any;

}
export interface UserProfilesAttribute {
    id?: number;
    year?: number;
    nickname?: string;
    created_at?: any;
    updated_at?: any;


}

export interface RefugeRequestsAttribute {
    id?: number;
    user_id?: number;
    content?: string;
    status?: string;
    created_at?: any;
    GraphObject?: GraphObjectsAttribute;

}

export interface RefugesAttribute {
    id?: number;
    name?: string;
    category_id?: number;
    active?: boolean;
    meta?: any;
    created_at?: any;
    updated_at?: any;
    RefugeArticles?: RefugeArticlesAttribute[],
    noticeArticles?: RefugeArticlesAttribute[],
    totalRecords?: number

}

export interface RefugeArticlesAttribute {
    id?: number;
    user_id?: number;
    refuge_id?: number;
    title?: string;
    hit?: number;
    content?: string;
    created_at?: any;
    updated_at?: any;
    anonymous?: boolean;
    isUserEmpathy?: number | boolean,
    empathyCount?: number,
    isMe?: boolean,
    isAdmin?: boolean,
    youtube?: boolean,
    thumbnail?: string,
    Refuge?: RefugesAttribute,
    UserProfile?: UserProfilesAttribute,
    RefugeArticleComments?: RefugeArticleCommentsAttribute[],
    header_id?: number,
    status_code?: number;



}

export interface RefugeArticleCommentsAttribute {
    id?: number;
    refuge_article_id?: number;
    user_id?: number;
    content?: string;
    parent?: number;
    mention_id?: number;
    status_code?: number;
    created_at?: any;
    updated_at?: any;
    anonymous?: boolean;
    UserProfile?: UserProfilesAttribute;
    isUpdate?: boolean

}

export interface CategoriesAttribute {
    id?: number;
    name?: string;
    Refuges?: RefugesAttribute[];
}

export interface AdministratorsAttribute {
    id?: number;
    permission_level: number;
    created_at?: any;
    updated_at?: any;
}


export interface PodcastsAttribute {
    id?: number;
    title?: string;
    description?: string;
    link?: string;
    created_at?: string;
    updated_at?: string;
}

export interface HaewoosoArticlesAttribute {
    id?: number;
    user_id?: number;
    content?: string;
    created_at?: any;
    meEdge?: GraphEdgesAttribute;
    GraphObject?: GraphObjectsAttribute
    HaewoosoArticleComments?: HaewoosoArticleCommentsAttribute[]

}

export interface HaewoosoArticleCommentsAttribute {
    id?: number;
    user_id?: number;
    haewooso_article_id?: number;
    content?: string;
    created_at?: any;

}