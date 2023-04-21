export { }
export interface Assignment {
    content_id: string
    course_id: string
    last_update: string
    url: string
    fileUrl: FileUrl[]
    score: string
    totalscore: string
    Name: string
    Due_Date: string
    Assignment_Files: FileUrl[]
}
export interface FileUrl {
    fileName: string
    fileURL: string
}
export interface Lecture {
    name: string
    link: string
    id: string
    time: string
    professor: string
    timeplace0: Timeplace
    timeplace1?: Timeplace
    timeplace2?: Timeplace
    timeplace3?: Timeplace
}
export interface ShapedLecture{
    name: string
    professor: string
    time: string
    link: string
    color: string
    timeplace: Timeplace
}
export interface Timeplace {
    day: string
    start: string
    end: string
    place: string
}