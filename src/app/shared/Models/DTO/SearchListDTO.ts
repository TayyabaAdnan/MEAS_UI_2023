import { Paginatedfilterdto } from '../Paginationfilterdto';

export class SearchListDTO extends Paginatedfilterdto {
      divisionId : string="";
      districtId : string="";
      tehsilId   : string="";
      ZoneId   : string="";
      HfTypeId:string="";
      ShiftId:string="";
      fromDate   : Date  ;
      toDate    : Date  ;
      applicationId : string="";
      ModuleId : string="";
      month : string="";
      year : string="";
      type : number;
}