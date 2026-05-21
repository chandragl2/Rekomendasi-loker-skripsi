const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (let file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.php') || fullPath.endsWith('.inc.php')) {
            processFile(fullPath);
        }
    }
}

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // mysql_db_query(db, query)
    content = content.replace(/mysql_db_query\s*\([^,]+,\s*(.*)\)/g, "mysqli_query($connect, $1)");

    // mysql_query(query)
    content = content.replace(/mysql_query\s*\(/g, "mysqli_query($connect, ");

    // For any 2-arg mysql_query (which we checked don't exist in the way that would break, but just in case)
    // Actually, replacing `mysql_query(` with `mysqli_query($connect, ` handles 1 argument perfectly. 
    // Example: mysql_query("SELECT...") -> mysqli_query($connect, "SELECT...")
    
    // mysql_fetch_*
    content = content.replace(/mysql_fetch_array\s*\(/g, "mysqli_fetch_array(");
    content = content.replace(/mysql_fetch_assoc\s*\(/g, "mysqli_fetch_assoc(");
    content = content.replace(/mysql_fetch_row\s*\(/g, "mysqli_fetch_row(");
    content = content.replace(/mysql_num_rows\s*\(/g, "mysqli_num_rows(");
    content = content.replace(/mysql_num_fields\s*\(/g, "mysqli_num_fields(");
    content = content.replace(/mysql_free_result\s*\(/g, "mysqli_free_result(");

    // mysql_insert_id(), mysql_affected_rows(), mysql_close(), mysql_error()
    content = content.replace(/mysql_insert_id\s*\(\)/g, "mysqli_insert_id($connect)");
    content = content.replace(/mysql_affected_rows\s*\(\)/g, "mysqli_affected_rows($connect)");
    content = content.replace(/mysql_close\s*\(\)/g, "mysqli_close($connect)");
    content = content.replace(/mysql_error\s*\(\)/g, "mysqli_error($connect)");

    // mysql_real_escape_string(str) -> mysqli_real_escape_string($connect, str)
    content = content.replace(/mysql_real_escape_string\s*\(/g, "mysqli_real_escape_string($connect, ");

    // mysql_select_db(db, link)
    content = content.replace(/mysql_select_db\s*\(([^,]+),\s*(.+?)\)/g, "mysqli_select_db($2, $1)");
    // mysql_select_db(db)
    content = content.replace(/mysql_select_db\s*\(([^,]+)\)/g, "mysqli_select_db($connect, $1)");

    // mysql_connect
    content = content.replace(/mysql_connect\s*\(/g, "mysqli_connect(");
    
    // special fixes for mysql_field_name($result, $i)
    content = content.replace(/mysql_field_name\s*\(([^,]+),\s*(.+?)\)/g, "mysqli_fetch_field_direct($1, $2)->name");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log("Updated: " + file);
    }
}

processDir('c:/xampp/htdocs/Trans');
