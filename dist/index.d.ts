declare const jalankanServer: () => Promise<{
    server: any;
    app: any;
}>;
declare const expressApp: Promise<{
    server: any;
    app: any;
}>;
declare const dapatkanPesan: (nomer: any) => Promise<unknown>;
declare const jawabPesan: (pesan: any, opsi: any, nomor: any) => Promise<void>;
declare const reaksiPesan: (pesan: any, opsi: any, nomor: any) => Promise<void>;
declare const abaikanPesan: (pesan: any, opsi: any, nomor: any) => Promise<void>;
declare const kirimkanPesan: (kepada: any, pesan: any, opsi: any) => Promise<void>;

export { abaikanPesan, dapatkanPesan, expressApp, jalankanServer, jawabPesan, kirimkanPesan, reaksiPesan };
