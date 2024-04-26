export interface Assignment {
	course_code?: string;
	content_id: string;
	course_id: string;
	engName?: string;
	last_update: string;
	url: string;
	fileUrl: FileUrl[];
	score: string;
	totalscore: string;
	Name: string;
	Due_Date: string;
	Assignment_Files: FileUrl[];
}
export interface Todo {
	content: string;
	course_name?: string;
	date: number;
	color: string;
	linkcode?: string;
	userCreated: boolean;
}
export interface BB_alarm {
	// content: string,
	detail: string;
	type: string;
	course_name: string;
	title: string;
	course_id: string;
	color: string;
	date: number;
	url: string;
}
export interface RawAlarm {
    se_id: string
    se_userId: any
    se_context: string
    se_details: string
    se_bottomContext: string
    se_timestamp: number
    se_courseId: string
    se_participated: boolean
    se_itemUri: string
    se_filterName: string
    extraAttribs: ExtraAttribs
    providerId: string
}
export interface ExtraAttribs {
    event_type: string
}
export interface AssignmentList {
	[key: string]: Assignment;
}
export interface FileUrl {
	fileName: string;
	fileURL: string;
}
export interface Lecture {
	name: string;
	engName: string;
	isLecture: boolean;
	link: string;
	id: string;
	calendarId?: string;
	color: string;
	time?: string;
	uuid?: string;
	professor?: string;
	timeplace0?: Timeplace;
	timeplace1?: Timeplace;
	timeplace2?: Timeplace;
	timeplace3?: Timeplace;
	assignment: Assignment[];
}
export interface lectureObject {
	[key: string]: Lecture;
}
export interface ShapedLecture {
	name: string;
	professor: string;
	time: string;
	link: string;
	color: string;
	timeplace: Timeplace;
}
export interface Timeplace {
	day: number;
	start:	number;
	end: number;
	place: string;
}
