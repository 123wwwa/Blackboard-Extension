export {};
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
	color: string;
	time?: string;
	professor?: string;
	timeplace0?: Timeplace;
	timeplace1?: Timeplace;
	timeplace2?: Timeplace;
	timeplace3?: Timeplace;
	assignment: Assignment[];
}
export interface LectureList {
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
	day: string;
	start: string;
	end: string;
	place: string;
}
export type AlignWith = "date" | "subject";
