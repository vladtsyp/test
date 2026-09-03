const qs = [["Основы RAG", "Что делает RAG перед тем, как LLM сформирует ответ?", 1, ["Обучает LLM на всех документах заново", "Находит релевантную информацию и передаёт её LLM как контекст", "Заменяет LLM на обычный поиск", "Хранит все документы внутри параметров LLM"], "RAG не переобучает модель: он извлекает релевантный внешний контекст для конкретного запроса."], ["Dense retrieval", "Что такое dense embedding?", 1, ["Разреженный список слов документа", "Числовой вектор, представляющий текст", "Список прав доступа", "Результат работы reranker"], "Dense embedding кодирует текст в плотный числовой вектор для поиска по семантической близости."], ["Dense vs sparse", "Как лучше всего описать различие dense и sparse retrieval?", 0, ["Dense ориентирован на семантическую близость, sparse — на lexical сигналы", "Dense всегда точнее sparse", "Sparse не работает с текстом", "Они отличаются только названием базы данных"], "Dense хорошо ловит смысловую близость, а sparse особенно полезен для точных терминов, ID и кодов."], ["BM25", "Почему BM25 полезен в корпоративном RAG?", 1, ["Гарантирует отсутствие галлюцинаций", "Хорошо работает с точными словами, ID, кодами и редкими терминами", "Полностью понимает смысл предложений", "Заменяет LLM"], "Lexical matching — сильная сторона BM25, особенно для идентификаторов и точных терминов."], ["BM42", "Какова основная идея BM42 в обсуждавшемся контексте?", 1, ["Заменить retrieval генерацией", "Дополнить BM25 сигналом важности токенов, связанным с Transformer attention", "Хранить документы как изображения", "Использовать только cosine similarity"], "Идея BM42 — использовать attention-derived importance вместе с lexical подходом BM25."], ["miniCOIL", "Чем miniCOIL концептуально отличается от обычного BM25?", 0, ["Добавляет контекстное neural-представление ключевых терминов", "Вообще не использует слова документа", "Является базой данных", "Всегда заменяет dense retrieval"], "miniCOIL сохраняет lexical характер sparse retrieval, но использует neural context для более информированного matching."], ["SPLADE", "В чём ключевая идея SPLADE?", 0, ["Vocabulary expansion в sparse-представлении", "Полный отказ от sparse representation", "Работа только с номерами документов", "Он является только reranker'ом"], "SPLADE может активировать дополнительные связанные термины, помогая при разных формулировках запроса и документа."], ["Hybrid search", "Зачем комбинировать dense и sparse retrieval?", 1, ["Получить два одинаковых списка", "Объединить семантический и lexical сигналы", "Убрать chunking", "Убрать необходимость в контексте"], "Dense помогает с перефразировками и смыслом, sparse — с точными терминами и identifiers."], ["RRF", "Зачем использовать RRF в hybrid retrieval?", 0, ["Объединять списки результатов по позициям в ranking", "Создавать embeddings", "Разбивать PDF на chunks", "Генерировать финальный ответ"], "RRF объединяет retrieval-списки по их рангам, не требуя напрямую сравнивать score разных шкал."], ["Reranking", "Почему reranker запускают после первичного retrieval?", 1, ["Потому что его дёшево применять ко всей коллекции", "Чтобы сначала быстро получить кандидатов, а затем точнее их упорядочить", "Чтобы заменить индексацию", "Чтобы убрать metadata"], "Двухступенчатая схема использует быстрый retrieval для кандидатов и более дорогой reranker для точного ranking."], ["Cross-encoder", "Что обычно получает cross-encoder reranker на вход?", 1, ["Только ID документа", "Пару query + document/chunk", "Только список токенов без запроса", "Только финальный ответ LLM"], "Cross-encoder напрямую оценивает релевантность конкретной пары запроса и кандидата."], ["Late interaction", "Что означает late interaction в retrieval?", 0, ["Взаимодействие query и document откладывается до стадии сопоставления после отдельных представлений", "Пользователь читает документ после ответа", "LLM отвечает медленно", "Embeddings создаются после генерации"], "Late interaction откладывает более подробное взаимодействие query/document до стадии сопоставления."], ["Parent/child", "Зачем использовать parent/child retrieval?", 0, ["Искать по маленьким фрагментам, но возвращать более широкий родительский контекст", "Полностью отказаться от chunks", "Заменить vector DB на LLM", "Хранить один chunk на документ"], "Child помогает точности retrieval, а parent помогает не потерять окружающий смысл."], ["Permissions", "Где должен учитываться контроль доступа в корпоративном RAG?", 1, ["Только после передачи закрытого документа LLM", "До передачи контекста LLM, в том числе через retrieval filters", "Только в CSS", "Только после генерации"], "Закрытые данные не должны попадать в контекст модели; фильтрация должна ограничивать множество доступных документов заранее."], ["Оценка качества", "Что измеряет Recall@K в retrieval?", 1, ["Красивость ответа LLM", "Попал ли релевантный документ или chunk в первые K результатов", "Число токенов LLM", "Число пользователей страницы"], "Recall@K показывает, удалось ли включить нужный результат в top-K retrieval."]]
;
let i=0, score=0, answered=false;
const $=id=>document.getElementById(id);
function render(){
  answered=false;
  const x=qs[i];
  $("counter").textContent=`${i+1} / ${qs.length}`;
  $("bar").style.width=`${i/qs.length*100}%`;
  $("topic").textContent=x[0];
  $("question").textContent=x[1];
  $("options").innerHTML="";
  $("feedback").hidden=true;
  $("next").disabled=true;
  $("next").textContent=i===qs.length-1?"Завершить →":"Далее →";
  x[3].forEach((text,n)=>{
    const b=document.createElement("button");
    b.className="option"; b.type="button";
    b.innerHTML=`<span class="letter">${String.fromCharCode(65+n)}</span><span>${text}</span>`;
    b.onclick=()=>answer(n);
    $("options").appendChild(b);
  });
}
function answer(n){
  if(answered)return;
  answered=true;
  const x=qs[i], correct=x[2];
  [...$("options").children].forEach((b,k)=>{
    b.disabled=true;
    if(k===correct)b.classList.add("correct");
    if(k===n&&k!==correct)b.classList.add("wrong");
  });
  if(n===correct){score++;$("feedbackTitle").textContent="Правильно";$("feedbackTitle").style.color="var(--green)"}
  else{$("feedbackTitle").textContent="Неправильно";$("feedbackTitle").style.color="var(--red)"}
  $("feedbackText").textContent=x[4];
  $("feedback").hidden=false;
  $("next").disabled=false;
}
$("next").onclick=()=>{
  if(!answered)return;
  if(i<qs.length-1){i++;render();scrollTo({top:0,behavior:"smooth"})}
  else{
    $("bar").style.width="100%";$("quiz").hidden=true;$("result").hidden=false;
    $("counter").textContent=`${qs.length} / ${qs.length}`;
    const p=Math.round(score/qs.length*100);
    $("resultTitle").textContent=`${score} из ${qs.length} верно`;
    $("resultText").textContent=p>=90?"Отлично. Основы RAG уже очень хорошо усвоены.":p>=70?"Хороший результат. Можно углубляться в retrieval и reranking.":p>=50?"Неплохо. Стоит повторить dense/sparse retrieval и архитектуру pipeline.":"Есть что повторить — перечитай конспект и попробуй тест ещё раз.";
  }
};
$("restart").onclick=()=>{i=0;score=0;$("result").hidden=true;$("quiz").hidden=false;render();scrollTo({top:0,behavior:"smooth"})};
render();
