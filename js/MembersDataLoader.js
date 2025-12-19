class MembersDataLoader {

    static MEMBERS_DATA_FILE_PATH = "./assets/members-data/";
    static MEMBERS_DATA_LIST = [];

    constructor() {
        // start loading immediately
        this.intLoadMemberData();
    }

    async intLoadMemberData() {
        try {
            const response = await fetch(MembersDataLoader.MEMBERS_DATA_FILE_PATH + "files.json");

            if (!response.ok) {
                console.error("files.json file is missing!");
                return;
            }

            const fileList = await response.json();
            console.log(`➤ ${fileList.length} yaml data files mentioned in files.json found!`);

            for (const fileName of fileList) {
                const fileResponse = await fetch(MembersDataLoader.MEMBERS_DATA_FILE_PATH + fileName);

                if (!fileResponse.ok) {
                    console.error("\t✗ " + fileName + " file mentioned in files.json was not found, Can not load it!");
                    continue;
                }

                const text = await fileResponse.text();
                const data = jsyaml.load(text);

                MembersDataLoader.MEMBERS_DATA_LIST.push(data);
                console.log("\t✓ " + fileName + " is successfully loaded!");
            }

        } catch (err) {
            console.error("Error loading member data:", err);
        }
    }
}

export default MembersDataLoader;
