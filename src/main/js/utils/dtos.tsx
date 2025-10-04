
export type handleJsonAnswer = (answer: any) => void;

export function postRequest(url:string, data:any, answer:handleJsonAnswer): void {
    fetch( url, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        } ).then( function( response ) {
		if (answer != undefined )
            answer( response.json() );
    } );
}

export function fetchJson(url:string, handleAnswer:handleJsonAnswer): void {
    fetch( url ) 
         .then( response => response.json() )
         .then( response => handleAnswer( response ));
}


// =====================================================
export class AccountRecord {
    id: number;
    received: Date;
    created: Date;
    executed: Date;
    type: number;
    sender: string;
    receiver: string;
    value: number;
    details: string;
    submitter: string;
    mandate: string;
    reference: string;

    constructor() {
        this.id = undefined;
        this.received = new Date();
        this.created = new Date();
        this.executed = new Date();
        this.type = 8;
        this.sender = '';
        this.receiver = '';
        this.value = 0;
        this.details = '';
        this.submitter = '';
        this.mandate = '';
        this.reference = '';
    }
}

//=====================================================
export class Pattern {
    sender: string;
    receiver: string;
    referenceID: string;
    mandate: string;
    senderID: string;
    details: string;
    [key: string]: string;

    constructor() {
        this.sender = '';
        this.senderID = '';
        this.receiver = '';
        this.referenceID = '';
        this.details = '';
        this.mandate = '';
    }

}

//=====================================================
export class Plan {
    id: number;
    startdate: Date;
    plandate: Date;
    enddate: Date;
    position: number;
    description: string;
    shortdescription: string;
    category: number;
    subcategory: number;
    categoryname: string;
    subcategoryname: string;
    value: number;
    patterndto: Pattern;
    matchstyle: number;

    constructor() {
        var date = new Date();
        this.id = undefined;
        this.startdate = date;
        this.plandate = date;
        this.enddate = date;
        this.position = 0;
        this.description = '';
        this.shortdescription = '';
        this.category = undefined;
        this.subcategory = undefined;
        this.categoryname = '';
        this.subcategoryname = '';
        this.value = 0;
        this.patterndto = new Pattern();
        this.matchstyle = 0;
    }
}

//=====================================================
export class Template {
    id?: number;
    validFrom: Date;
    validUntil: Date;
    start: Date;
    variance: number;
    repeatcount: number;
    repeatunit: number;
    description: string;
    category: number;
    subcategory: number;
    categoryname: string;
    subcategoryname: string;
    position: number;
    value: number;
    pattern: Pattern;
    shortdescription: string;
    matchstyle: number;
    previous: number;
	additional: string;

    constructor() {
        var date = new Date();
        this.id = undefined;
        this.validFrom = date;
        this.validUntil = undefined;
        this.start = date;
        this.variance = 4;
        this.repeatcount = 1;
        this.repeatunit = 2;
        this.description = '';
        this.category = undefined;
        this.subcategory = undefined;
        this.categoryname = '';
        this.subcategoryname = '';
        this.position = 1;
        this.value = 0;
        this.pattern = new Pattern();
        this.shortdescription = '';
        this.matchstyle = 0;
        this.previous = undefined;
		this.additional= "";
    }
}
//=====================================================

export class StatsDTO {
    max: number;
    min: number;
    data: StatsMonthDTO[];
}

export class StatsMonthDTO {
    day: Date;
    value: number;
    planvalue: number;
    forecast: number;
}

export class CatStatsDTO {
  estimated: number[];
  real: number[];
  catID: number;
  catName: string;
}

//=====================================================
export class  Assignment {
    id?: number;
    detail: string;
    description: string;
    planed?: number;
    real: number;
    committed: boolean;
    plan?: number;
    accountrecord: number;
    subcategory: number;
    category?: number;
}

export interface SubCategory {
    id: number;
    shortdescription: string;
    description: string;
    art: number;
    category: number;
    categoryName: string;
    favorite: boolean;
    active: boolean;
}

export interface Category {
    id: number;
    shortdescription: string;
    description: string;
    active: boolean;
}

//=====================================================
export interface EnumDTO {
    text: string;
    value: number;
}