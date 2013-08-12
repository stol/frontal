<?php
    $page = isset($page) ? $page : 1;
?>

<ul>
    <li>Item <?php echo ($page-1) * 5 + 1 ?></li>
    <li>Item <?php echo ($page-1) * 5 + 2 ?></li>
    <li>Item <?php echo ($page-1) * 5 + 3 ?></li>
    <li>Item <?php echo ($page-1) * 5 + 4 ?></li>
    <li>Item <?php echo ($page-1) * 5 + 5 ?></li>
</ul>

<?php if ($page >= 3) : ?>
    <p>Max page reached !</p>
<?php else : ?>
    <p><a class="btn js-sample-read-more" href="samples/2?page=<?php echo $page +1 ?>" data-p-ajaxify="1">Display 5 more</a></p>
<?php endif ?>

