echo $$ > runpid
until npm start > servlog.txt 2>&1; do
    echo "$(date -u) \t Server crashed with exit code $?.  Respawning.." >> crashlog.txt
    sleep 1
done

