const SCHEMANAME = 'blogapp';
const USERTABLE = 'blogapp.users';
const POSTTABLE = 'blogapp.posts';

class MigrationFile {
  constructor( migration ) {
    this.m = migration;
  }

  async up() {
    const minPosts = 0;
    const maxPosts = 4;
    const seeds = [];
    let insert = `INSERT INTO ${SCHEMANAME}.${POSTTABLE} (title, post, user_id, created_at, updated_at) VALUES `;
    // get users
    const userIds = await this.m.db.any( `SELECT id FROM ${SCHEMANAME}.${USERTABLE}` );
    for ( let ui = 0; ui < userIds.length; ui++ ) {
      const postCount = this.m.util.random.int( minPosts, maxPosts );
      if ( postCount ) {
        let script = '' + insert;
        for ( let i = 1; i <= postCount; i++ ) {
          let postContent = this.m.seed.paragraph(1,3);
          if(Math.random() >= 0.9) {
            postContent += "<br>" + this.m.seed.xss.noStrict();
          }
          if(Math.random() >= 0.85) {
            const imgUrl = this.m.seed.img.dummy(this.m.util.random.int(100,1000), this.m.util.random.int(10,300));
            postContent += "<br>" + `<img src="${imgUrl}">`;
          }
          const createdDate = this.m.seed.dateFriendly();
          let updatedDate = createdDate;
          if(Math.random() > 0.7) {
            updatedDate = this.m.seed.dateFriendly(new Date(createdDate), Date.now());
          }
          const values =
            `('${this.m.seed.lorem(1,1)}', '${postContent}', '${userIds[ui].id}', '${createdDate}', '${updatedDate}')`;
          script += values;
          if ( i < postCount ) {
            script += ', ';
          }
        }
        seeds.push( script );
      }
    }

    return seeds;
  }

  async down() {

  }
}

module.exports = MigrationFile;
